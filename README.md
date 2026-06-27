# Global-Trust-Bank-International-
Bank website for international payments
# 🏦 Global Trust Bank

## Enterprise Digital Banking Platform

Global Trust Bank is a modern fintech platform inspired by PayPal, Revolut, Wise, and Monzo.

The goal is to build a production-ready online banking system with enterprise security, modern UI, scalable architecture, and a complete administrative backend.

---

# Tech Stack

Frontend
- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- React Hook Form
- Chart.js
- Axios

Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Redis (sessions)
- Socket.io (real-time)

Storage
- Cloudinary (KYC uploads)
- AWS S3 ready

Payments
- Stripe
- Paystack
- Flutterwave
- Bank Transfer API

Deployment
- Docker
- GitHub Actions
- Railway
- Render
- Vercel

---

# Features

## Authentication

- Register
- Login
- Logout
- Forgot Password
- Reset Password
- Email Verification
- Two Factor Authentication
- JWT Authentication
- Refresh Tokens

---

## User Dashboard

Display

- Current Balance
- Available Balance
- Pending Balance

Cards

- Total Deposits
- Total Withdrawals
- Total Transfers

Charts

- Monthly Spending
- Deposits
- Withdrawals

Recent Transactions

Notifications

Profile Completion

---

## Wallet

Support

- USD
- EUR
- GBP

Future currencies should be easy to add.

---

## Banking

Users can

- Deposit
- Withdraw
- Transfer Money
- Receive Money
- Generate Transaction Receipts
- Download Statements
- Search Transactions
- Filter Transactions

Each transaction must have

- Unique Reference ID
- Status
- Timestamp
- Currency
- Amount
- Sender
- Receiver

---

## KYC

Upload

- Passport
- National ID
- Driver License

Upload

- Selfie

Upload

- Proof of Address

Admin can

- Approve
- Reject
- Request Resubmission

---

## Notifications

Users receive

- Deposit alerts
- Withdrawal alerts
- Login alerts
- Transfer alerts
- Security alerts

Support

- Email
- SMS
- In-app notifications

---

## Admin Dashboard

Admin authentication

Dashboard should display

- Total Users
- Total Deposits
- Total Withdrawals
- Total Transactions
- Revenue
- Currency Distribution

Admin can

- Create Users
- Edit Users
- Freeze Accounts
- Delete Accounts
- Credit Wallet
- Debit Wallet
- Approve KYC
- Reject KYC
- Reset Password
- Send Notifications
- Export Reports
- View Audit Logs

---

## Security

Use

- bcrypt password hashing
- JWT Authentication
- Role Based Access
- CSRF Protection
- Helmet
- Rate Limiting
- XSS Protection
- SQL Injection Protection

Never store passwords in plain text.

---

## UI Design

Style should resemble

- PayPal
- Revolut
- Monzo

Theme

Primary

- Navy Blue

Accent

- Gold

Secondary

- Green

Features

- Dark Mode
- Light Mode
- Responsive Design
- Mobile First
- Glassmorphism
- Smooth Animations

---

## Project Structure

/client

/pages

/components

/hooks

/context

/services

/assets

/server

/routes

/controllers

/middleware

/models

/prisma

/utils

/uploads

/database

/docs

---

## API Endpoints

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/forgot-password

POST /api/auth/reset-password

GET /api/users/profile

PUT /api/users/profile

POST /api/wallet/deposit

POST /api/wallet/withdraw

POST /api/wallet/transfer

GET /api/transactions

GET /api/admin/users

POST /api/admin/create-user

PUT /api/admin/update-user

DELETE /api/admin/delete-user

POST /api/admin/credit

POST /api/admin/debit

POST /api/admin/approve-kyc

POST /api/admin/reject-kyc

---

## Database

Tables

Users

Wallets

Transactions

KYC

Notifications

AuditLogs

Sessions

Currencies

Cards

Beneficiaries

---

## Dashboard Widgets

Balance Card

Income

Expenses

Transaction Graph

Latest Transactions

Exchange Rates

Notifications

Quick Actions

Analytics

---

## Final Goal

Build a complete enterprise-grade online banking application that is secure, scalable, responsive, production-ready, and easily deployable.

The application should be fully documented, modular, and maintainable with clean code architecture.

Every feature must function as a real banking platform, not merely a static demonstration.
