# Vorifi

Vorifi is a full-stack finance tracker Software as a Service (SaaS) designed to help users manage their finances efficiently. Built with modern technologies such as Next.js, React, Tailwind CSS, Neon (PostgreSQL), Drizzle ORM, Plaid, Microsoft Azure and Gemini API, Vorifi offers robust features like transaction management, account tracking, receipt scanning, and seamless banking integration.

---

## Table of Contents
1. [About The Project](#about-the-project)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)

---

## About The Project

Vorifi is a comprehensive financial management platform that provides users with tools to track expenses, income, and budgets while offering advanced features such as:
- User authentication and profile management.
- Transaction recording and categorization.
- AI chatbot for real time financial insight.
- Integration with banking services via Plaid.
- Data visualization through interactive dashboards.
- Receipt Tracking and Scanning System for seamless transaction addition.

The goal of Vorifi is to deliver a production-ready SaaS platform that simplifies financial tracking and decision-making for users.

---

## Features

- **User Authentication**: Secure login and registration using Clerk.
- **Transaction Management**: Add, edit, categorize, and delete transactions.
- **Financial Dashboards**: Visualize income vs. expenses with customizable charts.
- **Bank Integration**: Connect bank accounts via Plaid for real-time transaction imports.
- **AI Chatbot**: Gain real time financial insight with our Financial AI.
- **Data Import/Export**: Support for CSV imports and exports.
- **Expense Insights**: Gain insights into spending habits with detailed analytics.

---

## Tech Stack

| Technology       | Purpose                          |
|-------------------|----------------------------------|
| Next.js          | Frontend framework              |
| React            | UI library                      |
| Tailwind CSS     | Styling                         |
| Neon (PostgreSQL)| Database                        |
| Drizzle ORM      | Database migrations             |
| Plaid            | Bank integration                |
| Gemini AI API    | AI Chatbot integration          |
| Microsoft Azure  | Receipt Tracking System         |

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js v14.x or later**
- **npm or yarn**

### Installation Steps
1. Clone the repository: https://github.com/OmSanghvi/FinanceBuddyAppNew
2. Install dependencies: ```npm i```
3. Set up environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=

NEXT_PUBLIC_CLERK_SIGN_UP_URL=

DATABASE_URL =

NEXT_PUBLIC_APP_URL =

PLAID_CLIENT_TOKEN = 

PLAID_SECRET_TOKEN =

PLAID_ENV = 

GOOGLE_API_KEY = 

DOCUMENT_INTELLIGENCE_ENDPOINT=

DOCUMENT_INTELLIGENCE_API_KEY=
```

4. Run database migrations:

```npm run db:generate```

```npm run db:migrate```

5. Seed the database with mock data:

   ```npm run db:seed```

6. Start the development server:

   ```npm run dev```
