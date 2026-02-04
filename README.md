# 🚀 Decentralized Fiverr

A **decentralized crowdsourcing platform** for image labeling tasks, powered by Solana blockchain. Think Amazon Mechanical Turk, but with crypto payments.

![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

---

## ✨ Features

- 🔐 **Wallet-Based Authentication** - Sign in with your Solana wallet
- 💰 **Crypto Payments** - Pay for tasks and earn rewards in SOL
- 🖼️ **Image Labeling Tasks** - Create and complete thumbnail selection tasks
- ☁️ **Cloud Storage** - Direct image uploads to AWS S3
- ⚡ **Real-time Verification** - On-chain payment verification

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  User Frontend  │     │ Worker Frontend │
│   (Next.js)     │     │   (Next.js)     │
│   Port 3001     │     │   Port 3002     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   Backend   │
              │  (Express)  │
              │  Port 3000  │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
    │ Prisma  │ │   S3    │ │ Solana  │
    │PostgreSQL│ │ Storage │ │ Network │
    └─────────┘ └─────────┘ └─────────┘
```

---

## 📁 Project Structure

```
decentralised-fiver/
├── backend/                 # Express API server
│   ├── prisma/              # Database schema & migrations
│   └── src/
│       ├── routers/         # API routes (user.ts, worker.ts)
│       ├── middleware.ts    # JWT authentication
│       └── index.ts         # Server entry point
├── user-frontend/           # Task requestor application
│   ├── app/                 # Next.js app router pages
│   └── components/          # React components
└── worker-frontend/         # Task labeler application
    ├── src/app/             # Next.js app router pages
    └── components/          # React components
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS S3 bucket
- Solana wallet (Phantom recommended)

### Environment Setup

Create `.env` files in the backend directory:

```env
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/decentralised_fiver"
JWT_SECRET="your-secure-jwt-secret"
RPC_URL="https://api.devnet.solana.com"
ACCESS_KEY_ID="your-aws-access-key"
SECRET_ACCESS_KEY="your-aws-secret-key"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/rahulbhartigit/decentralised-fiver.git
cd decentralised-fiver

# Backend setup
cd backend
npm install
npx prisma migrate dev
npx prisma generate

# User Frontend setup
cd ../user-frontend
npm install

# Worker Frontend setup
cd ../worker-frontend
npm install
```

### Running the Application

```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm run dev

# Terminal 2 - User Frontend (port 3001)
cd user-frontend
npm run dev -- -p 3001

# Terminal 3 - Worker Frontend (port 3002)
cd worker-frontend
npm run dev -- -p 3002
```

---

## 📚 API Reference

### User Endpoints (`/v1/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signin` | Authenticate with wallet signature |
| GET | `/presignedUrl` | Get S3 upload URL |
| POST | `/task` | Create new labeling task |
| GET | `/task?taskId=` | Get task details & results |

### Worker Endpoints (`/v1/worker`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signin` | Worker authentication |
| GET | `/nextTask` | Get next available task |
| POST | `/submission` | Submit task label |
| GET | `/balance` | Check earnings balance |
| POST | `/payout` | Request payout |

---

## 💡 How It Works

### For Task Requestors (Users)
1. Connect your Solana wallet
2. Upload images to label
3. Pay 0.1 SOL to create the task
4. View results as workers complete labeling

### For Labelers (Workers)
1. Connect your Solana wallet
2. Browse available tasks
3. Select the best option for each task
4. Earn SOL for each submission
5. Request payout when ready

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| Backend | Express.js 5, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Blockchain | Solana, @solana/web3.js |
| Storage | AWS S3 |
| Auth | JWT, Wallet Signatures |

---

## 📄 License

ISC

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
