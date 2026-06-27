# 🏦 Global Trust Bank International

## Enterprise Digital Banking Platform

Global Trust Bank is a modern fintech platform inspired by PayPal, Revolut, Wise, and Monzo. A production-ready online banking system with enterprise security, modern UI, scalable architecture, and a complete administrative backend.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - API framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database client
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Redis** - Session management
- **Socket.io** - Real-time updates

### Storage & Payment
- **Cloudinary** - File uploads (KYC)
- **AWS S3** - Cloud storage
- **Stripe** - Payment processing
- **Paystack** - African payments
- **Flutterwave** - Multi-currency payments

### Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Railway/Render** - Backend hosting
- **Vercel** - Frontend hosting

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- Email verification
- Two-factor authentication (2FA)
- JWT + Refresh tokens
- Password reset
- Session management

### 💳 User Dashboard
**Display:**
- Current, available, and pending balance
- Total deposits, withdrawals, transfers
- Monthly spending charts
- Recent transactions
- Notifications

**Cards:**
- Debit card management
- Card limits
- Card freeze/block

### 💰 Wallet Management
- Multi-currency support (USD, EUR, GBP)
- Easy currency addition
- Real-time balance updates
- Wallet history

### 🏦 Banking Operations
**Users can:**
- Deposit funds
- Withdraw funds
- Transfer money (local & international)
- Receive money
- Generate transaction receipts
- Download statements
- Search & filter transactions

**Transaction Details:**
- Unique reference ID
- Status (pending, completed, failed)
- Timestamp
- Currency
- Amount
- Sender/Receiver info

### 🆔 KYC (Know Your Customer)
**Document Upload:**
- Passport
- National ID
- Driver License
- Selfie verification
- Proof of address

**Admin Actions:**
- Approve/Reject submissions
- Request resubmission

### 🔔 Notifications
**Types:**
- Deposit alerts
- Withdrawal alerts
- Login alerts
- Transfer alerts
- Security alerts

**Channels:**
- Email
- SMS
- In-app notifications

### 👨‍💼 Admin Dashboard
**Analytics:**
- Total users & transactions
- Total deposits/withdrawals
- Revenue tracking
- Currency distribution

**User Management:**
- Create/Edit/Delete users
- Freeze/Unfreeze accounts
- Credit/Debit wallets
- Reset passwords
- Send notifications

**KYC Management:**
- Approve/Reject submissions
- Request additional documents

**System:**
- Export reports
- View audit logs
- Manage system settings

---

## 📁 Project Structure

```
Global-Trust-Bank-International/
├── client/                          # Frontend (Next.js)
│   ├── app/
│   │   ├── (auth)/                 # Auth routes
│   │   ├── (dashboard)/            # User dashboard
│   │   ├── admin/                  # Admin dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── shared/
│   │   └── charts/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   └── useTransactions.ts
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── server/                          # Backend (Express)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── wallet.routes.ts
│   │   │   ├── transaction.routes.ts
│   │   │   ├── kyc.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── wallet.controller.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── kyc.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── validation.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── wallet.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── kyc.service.ts
│   │   │   ├── payment.service.ts
│   │   │   └── email.service.ts
│   │   ├── models/
│   │   │   └── (Prisma generated)
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── hash.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── stripe.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   ├── DATABASE.md
│   └── SECURITY.md
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis
- Docker (optional)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Daddypupa/Global-Trust-Bank-International-.git
cd Global-Trust-Bank-International-
```

**2. Setup Backend:**
```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

**3. Setup Frontend:**
```bash
cd ../client
npm install
cp .env.local.example .env.local
npm run dev
```

**4. Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin: http://localhost:3000/admin

---

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh-token
POST /api/auth/2fa/enable
POST /api/auth/2fa/verify
```

### User Endpoints

```
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/kyc
POST /api/users/kyc/upload
PUT  /api/users/settings
```

### Wallet Endpoints

```
GET  /api/wallet/balance
POST /api/wallet/deposit
POST /api/wallet/withdraw
POST /api/wallet/transfer
GET  /api/wallet/history
```

### Transaction Endpoints

```
GET  /api/transactions
GET  /api/transactions/:id
GET  /api/transactions/search
POST /api/transactions/receipt
```

### KYC Endpoints

```
POST /api/kyc/upload
GET  /api/kyc/status
GET  /api/kyc/history
```

### Admin Endpoints

```
GET    /api/admin/dashboard
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
POST   /api/admin/wallet/credit
POST   /api/admin/wallet/debit
GET    /api/admin/kyc
POST   /api/admin/kyc/:id/approve
POST   /api/admin/kyc/:id/reject
GET    /api/admin/transactions
GET    /api/admin/reports
GET    /api/admin/audit-logs
```

---

## 🗄 Database Schema

### Core Tables

**users**
- id (UUID)
- email (unique)
- password (hashed)
- firstName, lastName
- phone
- verified
- twoFactorEnabled
- kycStatus (pending, approved, rejected)
- accountStatus (active, frozen, suspended)
- role (user, admin)
- createdAt, updatedAt

**wallets**
- id (UUID)
- userId (FK)
- currency (USD, EUR, GBP)
- balance
- availableBalance
- pendingBalance
- createdAt, updatedAt

**transactions**
- id (UUID)
- referenceId (unique)
- senderId (FK)
- receiverId (FK)
- walletId (FK)
- type (deposit, withdrawal, transfer)
- amount
- currency
- status (pending, completed, failed)
- description
- timestamp
- createdAt, updatedAt

**kyc**
- id (UUID)
- userId (FK)
- documentType (passport, id, license)
- documentUrl
- selfieUrl
- addressProofUrl
- status (pending, approved, rejected)
- rejectionReason
- submittedAt
- reviewedAt, reviewedBy

**notifications**
- id (UUID)
- userId (FK)
- type (deposit, withdrawal, login, transfer, security)
- title, message
- read
- createdAt

**audit_logs**
- id (UUID)
- userId (FK)
- action
- entityType
- entityId
- changes
- timestamp

**sessions**
- id (UUID)
- userId (FK)
- token
- expiresAt
- createdAt

---

## 🔒 Security

### Implementation
- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT authentication with expiration
- ✅ Role-Based Access Control (RBAC)
- ✅ CSRF protection (tokens)
- ✅ Helmet.js security headers
- ✅ Rate limiting (express-rate-limit)
- ✅ XSS protection (HTML sanitization)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ Input validation & sanitization
- ✅ HTTPS enforcement
- ✅ Secure password reset flow
- ✅ Session management with Redis
- ✅ Two-factor authentication (TOTP)
- ✅ Audit logging for all admin actions

### Best Practices
- Never store passwords in plain text
- Use environment variables for secrets
- Implement request signing for sensitive operations
- Enable CORS selectively
- Regular security audits
- Keep dependencies updated

---

## 🎨 UI Design

**Theme:**
- **Primary:** Navy Blue
- **Accent:** Gold
- **Secondary:** Green

**Features:**
- Dark Mode & Light Mode
- Responsive Design
- Mobile First Approach
- Glassmorphism effects
- Smooth Animations

---

## 🚢 Deployment

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Configure PostgreSQL database
4. Deploy automatically on push

### Frontend (Vercel)
1. Import Next.js project
2. Set environment variables
3. Deploy automatically on push

### Docker
```bash
docker-compose up -d
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact & Support

For support, email: support@globaltrustbank.com

---

**Last Updated:** June 2026  
**Status:** 🚀 In Development
