# Survey Project

A Playwright-based testing project with PostgreSQL database integration.

## 🚀 Features

- End-to-end testing with Playwright
- PostgreSQL database integration
- Automated test execution
- GitHub Actions CI/CD workflow

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Sandeepkadaru/Survey.git
cd Survey
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your database connection details:
   ```
   DB_HOST=your_host
   DB_PORT=5432
   DB_NAME=your_database
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

## 🧪 Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

Run tests in UI mode:
```bash
npm run test:ui
```

Run a specific test file:
```bash
npx playwright test tests/example.spec.ts
```

View test report:
```bash
npm run test:report
```

## 📁 Project Structure

```
Survey/
├── tests/              # Test files
│   ├── example.spec.ts
│   └── schema.spec.ts
├── test-data/         # Test data files
├── playwright.config.ts # Playwright configuration
├── package.json       # Project dependencies
└── .env              # Environment variables (not in git)
```

## 🔧 Configuration

Playwright configuration can be customized in `playwright.config.ts`. The default setup includes:
- Chromium browser testing
- HTML reporter
- Retry logic for CI environments

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Sandeepkadaru**
- GitHub: [@Sandeepkadaru](https://github.com/Sandeepkadaru)
- Email: sandeep.kadaru@gmail.com

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) for the excellent testing framework
- [PostgreSQL](https://www.postgresql.org/) for the database

