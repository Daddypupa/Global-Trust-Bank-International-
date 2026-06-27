# Global Trust Bank - Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional)
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Daddypupa/Global-Trust-Bank-International-.git
cd Global-Trust-Bank-International-
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/global_trust_bank
# REDIS_URL=redis://localhost:6379

# Run Prisma migrations
npx prisma migrate dev

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Update API URL if needed
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Docker Setup (Optional)

### Quick Start with Docker Compose

```bash
# Set up environment
cp server/.env.example .env
cp client/.env.local.example .env.local

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Database Setup

### Create Database

```bash
createdb global_trust_bank
```

### Run Migrations

```bash
cd server
npx prisma migrate dev
```

### Access Prisma Studio

```bash
npx prisma studio
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/global_trust_bank
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_xxx
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
```

## Project Structure

```
Global-Trust-Bank-International-/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App routes
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── styles/        # Global styles
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Services
│   │   └── utils/         # Utilities
│   ├── prisma/           # Database schema
│   └── package.json
└── docker-compose.yml
```

## Development Commands

### Backend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma studio
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Troubleshooting

### Database Connection Failed

- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Ensure database exists

### Port Already in Use

```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Dependencies Issue

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# Remove containers and volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## API Documentation

API endpoints documentation is available in the [API.md](./API.md) file.

## Security Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Keep dependencies updated
- Use environment variables for sensitive data

## Support

For issues and questions, please open an issue on GitHub.
