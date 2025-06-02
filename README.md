# Circuit Smith Backend

A Node.js API for the Circuit Smith application with PostgreSQL database integration.

## Project Structure

```
circuit-smith-backend/
│
├── src/                      # Application source code
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── db/                   # Database setup and migrations
│   ├── middleware/           # Express middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   └── app.js                # Express app setup
│
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── package.json              # Dependencies and scripts
├── README.md                 # Project documentation
└── server.js                 # Application entry point
```

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Set up your Neon PostgreSQL database and add credentials to `.env`
5. Run migrations: `npm run migrate`
6. Start the server: `npm run start`

## Available Scripts

- `npm run start` - Start the server
- `npm run dev` - Start the server with nodemon
- `npm run migrate` - Run database migrations
- `npm run test` - Run tests

### Environment Variables

Create a `.env` file with the following variables:

```

NODE_ENV=development
PORT=3000
DATABASE_URL=
JWT_SECRET=

```

```

```
