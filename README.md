# Fade Boba POS System

A full-stack point-of-sale and operations platform for a bubble tea shop, developed as a collaborative software engineering project at Texas A&M University.

This repository is a **sanitized public portfolio snapshot** of the original private team project. Credentials, course-hosted database access, personal staff-account information, private deployment configuration, and unverified third-party image assets have been removed or replaced before publication.

## Project Overview

Fade Boba combines a React frontend, a Node.js/Express REST API, and PostgreSQL to support customer ordering, cashier workflows, manager operations, reporting, accessibility features, external API integrations, and an AI-powered menu assistant.

The application is organized around three primary interfaces:

- **Customer kiosk** for browsing, customizing, and placing drink orders
- **Cashier POS** for processing orders, tracking queues, viewing history, and handling refunds
- **Manager dashboard** for inventory, employee, recipe, pricing, and sales-report workflows

## Features

### Customer Kiosk

- Browse drinks and add-ons
- Filter menu items by category
- Customize drink size, temperature, ice level, sugar level, and add-ons
- Maintain a shopping cart and place orders
- View order confirmations and receipts
- Save favorite drinks for signed-in customers
- View recent orders and reorder previous purchases
- Receive weather-aware drink recommendations
- Translate interface text into multiple languages
- Use high-contrast and adjustable-text-size accessibility modes

### Cashier POS

- Employee authentication flows
- Build and customize customer orders
- Process orders and generate receipts
- View and update the active order queue
- Review transaction history
- Inspect order details
- Process refunds
- Access recipe information

### Manager Dashboard

- View revenue, order counts, average order value, and low-stock metrics
- Review daily sales summaries and recent orders
- Monitor and restock inventory
- Update menu prices and menu items
- Manage employees and roles
- Manage recipes and ingredient quantities
- Generate X-Reports for current-day sales
- Preview and finalize Z-Reports
- Review historical Z-Reports

### AI Menu Assistant

The backend includes a conversational menu assistant using the Google Gemini API. The service retrieves current menu data from PostgreSQL and injects that data into the model context so the assistant can answer menu questions and make recommendations based on items that actually exist in the database.

The Gemini API key is read from server-side environment configuration and is **not included** in this repository.

### Accessibility

The frontend includes accessibility-focused functionality such as:

- Standard and high-contrast display modes
- Normal, large, and extra-large text settings
- Persistent accessibility preferences
- Keyboard-oriented navigation support
- ARIA labels and live announcements
- Multilingual interface support

### Weather-Aware Recommendations

The customer kiosk integrates current weather data from Open-Meteo and uses local temperature to surface drink recommendations.

### QA and Usability Testing

The project also contains internal testing utilities for:

- Acceptance-criteria checklists
- Pass/fail tracking
- Test notes
- Markdown and JSON test-result export
- Usability feedback collection
- Task-success tracking
- Ease-of-use ratings
- Completion-time measurements

## Architecture

```text
                         +----------------------+
                         |     React Client     |
                         |----------------------|
                         | Customer Kiosk       |
                         | Cashier POS          |
                         | Manager Dashboard    |
                         | Menu Board           |
                         | QA / User Study      |
                         +----------+-----------+
                                    |
                                    | REST / JSON
                                    v
                         +----------------------+
                         |   Node.js / Express  |
                         |----------------------|
                         | Authentication       |
                         | Menu                 |
                         | Orders               |
                         | Inventory            |
                         | Employees            |
                         | Recipes              |
                         | Reports              |
                         | Translation          |
                         | AI Assistant         |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |      PostgreSQL      |
                         +----------------------+

External integrations:
- Google OAuth
- Google Gemini
- Open-Meteo
- MyMemory translation service
```

## Technology Stack

### Frontend

- React 18
- React Router
- JavaScript
- Google OAuth
- HTML/CSS

### Backend

- Node.js
- Express.js
- PostgreSQL (`pg`)
- REST APIs
- Google Gemini API
- Google authentication libraries

### Data / Tooling

- PostgreSQL
- SQL
- Database migrations
- Seed scripts
- Database indexing and optimization scripts
- Environment-based configuration

## Code Worth Exploring

- `frontend/src/pages/CustomerKiosk.js` — customer ordering, customization, favorites, weather recommendations, and order history
- `frontend/src/pages/Cashier.js` — cashier POS workflow and order management
- `frontend/src/pages/Manager.js` — inventory, employee, recipe, pricing, and reporting workflows
- `backend/routes/orders.js` — transactional order creation, line items, add-ons, inventory deduction, queues, and refunds
- `backend/routes/chatbot.js` — Gemini integration with database-driven menu context
- `backend/routes/reports.js` — X-Report and Z-Report functionality
- `frontend/src/components/AccessibilityWidget.js` — persistent accessibility controls
- `frontend/src/pages/QAConsole.js` — acceptance-testing workflow and test-result export
- `frontend/src/pages/UserStudy.js` — usability-testing data collection

## Collaboration and Portfolio Note

This was a **team project**. I am sharing this sanitized portfolio version with permission to make the project reviewable while protecting credentials, private infrastructure, personal account information, and other material that should not be published.

The original collaborative repository remains private. This public snapshot should be evaluated as a team software-engineering artifact; it does not claim that every file in the repository was authored by a single contributor.

## Local Development

### Prerequisites

- Node.js and npm
- PostgreSQL
- A Google OAuth client ID if testing Google sign-in
- A Gemini API key if testing the AI assistant

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configure `.env` for your own PostgreSQL instance and optional API integrations, then run:

```bash
npm start
```

The backend defaults to:

```text
http://localhost:3001
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.development
npm start
```

The frontend defaults to:

```text
http://localhost:3000
```

## Database Note

The original application used a course-hosted PostgreSQL database. That database and its credentials are intentionally not included in this public portfolio snapshot.

The source archive contains representative database tooling such as seed data, migrations, usability-table SQL, recipe support, and optimization/index scripts. The complete original base schema was not included in the archive used to produce this public snapshot, so a compatible PostgreSQL schema is required to run the entire application locally.

## Environment Configuration

Real environment files are excluded from version control. Use these templates instead:

```text
backend/.env.example
frontend/.env.example
```

Do not commit real database passwords, OAuth credentials, API keys, or other secrets.

## Security / Deployment Note

This codebase was built as an academic prototype and is **not presented as a production-hardened system**. Before deploying it against real or sensitive data, add production-grade authorization controls, stricter CORS configuration, rate limiting, secret management, validation, and other appropriate security controls.

## Public-Snapshot Changes

For this portfolio version:

- Real `.env` files were removed
- Database credentials and API keys were excluded
- Personal staff-account email fallbacks were removed
- Frontend API and Google OAuth configuration were moved to environment variables
- Original image assets were replaced with generated placeholders because their licensing could not be verified from the provided archive
- Private Render/Texas A&M deployment references were removed from documentation and frontend configuration

## License

No open-source license is granted by this repository. This is a public portfolio snapshot of a collaborative academic project.
