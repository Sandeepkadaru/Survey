// tests/insert.spec.ts
import { test, expect } from '@playwright/test';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'postgres',
};

const seedPath = path.join(__dirname, '../test-data/seed.json');

if (!fs.existsSync(seedPath)) {
  throw new Error(`Seed file not found: ${seedPath}. Create ./test-data/seed.json`);
}
const payloads = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as any[];

let client: Client;

test.describe('DB Insert (data-driven) — Azka Survey seeder', () => {

  test.beforeAll(async () => {
    client = new Client(dbConfig);
    await client.connect();
  });

  test.afterAll(async () => {
    if (client) await client.end();
  });

  test('Insert seed payloads into DB', async () => {
    const results: Array<{ userId: number; surveyId: number; email: string }> = [];

    for (const payload of payloads) {
      // Start transaction for each payload to keep inserts atomic
      try {
        await client.query('BEGIN');

        // 1) Upsert user (unique on email). If exists, return existing user_id
        //    Requires users.email unique — matches schema created earlier.
        const upsertUserQ = `
          INSERT INTO users (email, password_hash, display_name)
          VALUES ($1, $2, $3)
          ON CONFLICT (email) DO UPDATE
            SET password_hash = EXCLUDED.password_hash
          RETURNING user_id;
        `;
        const userRes = await client.query(upsertUserQ, [
          payload.user.email,
          payload.user.password_hash,
          payload.user.display_name || null,
        ]);
        const userId: number = userRes.rows[0].user_id;

        // 2) Create a survey row for this user
        //    If you want to avoid duplicates for the same user, you can check existing surveys.
        //    Here we always create a new survey row to represent one submission.
        const surveyRes = await client.query(
          `INSERT INTO surveys (user_id) VALUES ($1) RETURNING survey_id`,
          [userId]
        );
        const surveyId: number = surveyRes.rows[0].survey_id;

        // 3) personal_details
        const pd = payload.personal_details;
        await client.query(
          `INSERT INTO personal_details (
            survey_id, name, address, phone, gender, state, town,
            constituency_mla, mandal, constituency_mp, religion, age, caste, ward
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
          [
            surveyId,
            pd.name,
            pd.address,
            pd.phone,
            pd.gender,
            pd.state,
            pd.town,
            pd.constituency_mla,
            pd.mandal,
            pd.constituency_mp,
            pd.religion,
            pd.age,
            pd.caste,
            pd.ward,
          ]
        );

        // 4) family_details
        const fd = payload.family_details;
        await client.query(
          `INSERT INTO family_details (
            survey_id, total_family_members, total_earning_members, occupation,
            no_of_children, how_many_females, how_many_males
          ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            surveyId,
            fd.total_family_members,
            fd.total_earning_members,
            fd.occupation,
            fd.no_of_children,
            fd.how_many_females,
            fd.how_many_males,
          ]
        );

        // 5) income_details
        const id = payload.income_details;
        await client.query(
          `INSERT INTO income_details (
            survey_id, how_many_earners, saving_per_month, debt_range, interest_rate, source_of_debt
          ) VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            surveyId,
            id.how_many_earners,
            id.saving_per_month,
            id.debt_range,
            id.interest_rate,
            id.source_of_debt,
          ]
        );

        // 6) government_details
        const gd = payload.government_details;
        await client.query(
          `INSERT INTO government_details (
            survey_id, street_roads, town_village_roads, district_connecting_roads,
            transportation, government_hospitals, government_school_facilities,
            government_facilities_availability, will_you_vote_same_government
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            surveyId,
            gd.street_roads,
            gd.town_village_roads,
            gd.district_connecting_roads,
            gd.transportation,
            gd.government_hospitals,
            gd.government_school_facilities,
            gd.government_facilities_availability,
            gd.will_you_vote_same_government,
          ]
        );

        // All inserts OK — commit
        await client.query('COMMIT');

        results.push({ userId, surveyId, email: payload.user.email });
      } catch (err) {
        await client.query('ROLLBACK');
        // Attach helpful context and rethrow so Playwright will fail the test with a useful message
        throw new Error(`Failed to seed payload for email=${payload?.user?.email} -> ${String(err)}`);
      }
    } // end for payloads

    // Assertions: basic sanity checks
    expect(results.length).toBe(payloads.length);

    // For each created survey id check that personal_details exists
    for (const r of results) {
      const res = await client.query(`SELECT count(*) as cnt FROM personal_details WHERE survey_id = $1`, [r.surveyId]);
      const cnt = Number(res.rows[0].cnt);
      expect(cnt, `personal_details missing for survey ${r.surveyId} (user ${r.email})`).toBeGreaterThan(0);
    }

    // Optionally log results to help with debugging
    console.log('Seeded results:', results);
  });

});