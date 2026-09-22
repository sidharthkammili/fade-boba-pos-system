# Fade Boba POS System

A full-stack point-of-sale and shop operations platform built with React, Node.js/Express, and PostgreSQL.

Fade Boba was developed as a **team project at Texas A&M University**. The original repository is maintained under the course organization and is not publicly accessible, so I created this sanitized copy on my personal GitHub to make the project reviewable by recruiters. The application code remains a team effort; the section below calls out the work that was specifically assigned to me during the project.

**Tech:** React · JavaScript · Node.js · Express · PostgreSQL · REST APIs · Google OAuth · Google Gemini

## What the Application Does

Fade Boba supports three main workflows:

- **Customer kiosk** — browse the menu, customize drinks, manage a cart, place orders, view receipts, save favorites, reorder previous purchases, and receive weather-aware recommendations
- **Cashier POS** — create and customize orders, manage the order queue, review transactions, view receipts, and process refunds
- **Manager dashboard** — manage inventory, employees, recipes, menu pricing, and sales reporting

The project also includes accessibility features, multilingual support, usability testing tools, and an AI-powered menu assistant.

## My Contributions

According to our team sprint backlog, my assigned work included the following.

### Backend and Deployment

- Developed backend routes during the first sprint
- Deployed the backend MVP to Render
- Helped establish the backend portion of the application's client/server workflow

### Accessibility and Localization

- Integrated menu translation functionality
- Implemented screen-reader support using ARIA attributes and announcements
- Added keyboard navigation support for the manager workflow
- Added high-contrast and text-scaling modes

### Reporting and Data

- Implemented the manager **X-Report** for daily sales
- Worked on database schema optimization, including indexing and query improvements

### Customer Experience

- Added drink size options for small, medium, and large
- Added hot drink customization where applicable
- Added quantity controls so customers can increase or decrease multiple items in an order
- Updated the UI so the top header remains visible during navigation

### Testing and Usability

- Performed acceptance-criteria verification for:
  - Customer kiosk
  - Cashier POS
  - Manager dashboard
- Set up usability testing and feedback collection
- Contributed to the final technical demo script and video

Because this public repository is a sanitized copy rather than the original course repository, its commit history does **not** represent the full semester-long team development history.

## Key Features

### Customer Kiosk

- Menu browsing and category filtering
- Drink customization:
  - Size
  - Temperature
  - Ice level
  - Sugar level
  - Add-ons
- Cart and checkout flow
- Digital receipt display
- Favorites and recent-order support
- Reordering previous purchases
- Weather-aware drink recommendations
- Multilingual interface support
- Accessibility controls

### Cashier POS

- Employee login
- Order creation and customization
- Active order queue
- Transaction history
- Order details
- Refund workflow
- Receipt generation
- Recipe lookup

### Manager Dashboard

- Revenue and order metrics
- Inventory monitoring and restocking
- Menu price and item management
- Employee management
- Recipe management
- X-Report and Z-Report workflows
- Historical sales reporting

### AI Menu Assistant

The backend includes a conversational menu assistant powered by the Google Gemini API.

The service retrieves the current menu from PostgreSQL and supplies that menu data as context to the model so it can answer menu-related questions and make recommendations based on items that actually exist in the system.

API credentials are read from environment variables and are not included in this public repository.

### Accessibility

The frontend includes:

- High-contrast mode
- Multiple text-size settings
- Persistent accessibility preferences
- Keyboard-oriented navigation
- ARIA labels and live announcements
- Multilingual support

### Weather-Based Recommendations

The customer kiosk uses weather data from Open-Meteo to surface drink recommendations based on local temperature.

### QA and Usability Tools

The project includes internal tools for:

- Acceptance-criteria checklists
- Pass/fail tracking
- Test notes
- Markdown and JSON test-result export
- Usability feedback
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
- Translation service
```

## Technology Stack

### Frontend

- React 18
- React Router
- JavaScript
- HTML/CSS
- Google OAuth

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
- Database indexing and query optimization
- Environment-based configuration

## Code Worth Exploring

- `backend/routes/orders.js` — order creation, line items, add-ons, inventory deduction, queues, and refunds
- `backend/routes/reports.js` — sales reporting workflows
- `backend/routes/chatbot.js` — Gemini integration with database-driven menu context
- `frontend/src/pages/CustomerKiosk.js` — ordering, customization, favorites, weather recommendations, and order history
- `frontend/src/pages/Cashier.js` — cashier workflow and transaction management
- `frontend/src/pages/Manager.js` — inventory, employee, recipe, pricing, and reporting workflows
- `frontend/src/components/AccessibilityWidget.js` — persistent accessibility controls
- `frontend/src/pages/QAConsole.js` — acceptance-testing workflow
- `frontend/src/pages/UserStudy.js` — usability-testing data collection

A more detailed breakdown of my assigned work is available in [CONTRIBUTIONS.md](./CONTRIBUTIONS.md).

## Running Locally

### Prerequisites

- Node.js and npm
- PostgreSQL
- Google OAuth client ID if testing Google sign-in
- Gemini API key if testing the AI assistant

### Backend

```bash
cd backend
npm install
cp .env.example .env
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

The original application used a Texas A&M course-hosted PostgreSQL database. That database and its credentials are not included here.

This repository contains seed data, migration scripts, usability-table SQL, recipe support, and optimization/index scripts. The complete original base schema was not part of the archive used to create this public copy, so a compatible PostgreSQL schema is required to run the full application locally.

## Portfolio Copy / Sanitization Note

This repository exists so recruiters can review a project that was originally developed in a private Texas A&M course organization.

Before moving the project to my personal account, I removed or replaced:

- Database credentials
- API keys
- Real `.env` files
- Personal staff-account email fallbacks
- Private course/deployment configuration
- Original image assets whose licensing could not be verified

The application itself remains a **collaborative school project**, and I do not claim sole authorship of the full codebase.

## License

No open-source license is granted by this repository. This is a public portfolio copy of a collaborative academic project.
