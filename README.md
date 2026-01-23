# REST API Project (Assignment 1 Refactor)

Production-ready REST API in TypeScript with full user management, relational modeling (Users, Posts, Comments), JWT authentication with refresh tokens, Swagger docs, and Jest tests.

## Features

- Users: full CRUD (`username`, `email`)
- Posts: Users can create posts
- Comments: Users can comment on posts
- Auth: register, login, refresh, logout with JWT access + refresh tokens
- Swagger docs at `/docs`
- Jest tests covering all endpoints

## Tech Stack

- TypeScript, Node.js, Express
- JWT authentication with refresh tokens
- Jest + Supertest
- Swagger UI

## Setup

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file (optional; defaults are provided):

```bash
PORT=3000
ACCESS_TOKEN_SECRET=change-me
REFRESH_TOKEN_SECRET=change-me-too
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
```

### Run

```bash
npm run dev
```

The server starts at `http://localhost:3000` and Swagger UI is at `http://localhost:3000/docs`.

### Production Build

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Run in development mode
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run Jest tests

## API Endpoints

### Auth
- **POST** `/auth/register`
- **POST** `/auth/login`
- **POST** `/auth/refresh`
- **POST** `/auth/logout`

### Users
- **GET** `/users`
- **GET** `/users/:userId`
- **POST** `/users`
- **PUT** `/users/:userId`
- **DELETE** `/users/:userId`

### Posts
- **GET** `/post`
- **GET** `/post/:postId`
- **POST** `/post`
- **PUT** `/post/:postId`
- **DELETE** `/post/:postId`

### Comments
- **GET** `/comment`
- **GET** `/comment/:commentId`
- **POST** `/comment`
- **PUT** `/comment/:commentId`
- **DELETE** `/comment/:commentId`

## Project Structure

```
internet-apps/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── docs/
│   ├── middleware/
│   ├── routes/
│   ├── store/
│   └── utils/
├── tests/
├── jest.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Notes

- The current data layer is an in-memory store that models relationships between users, posts, and comments for the Assignment 1 baseline. Swap the store for a database adapter to persist data in production.

