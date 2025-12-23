# REST API Project

A REST API built with Node.js and Express for managing Posts and Comments.

## Features

### Posts API
- **POST** `/post` - Add a new post
- **GET** `/post` - Get all posts
- **GET** `/post/:post_id` - Get a post by ID
- **GET** `/post?sender=<sender_id>` - Get posts by sender ID
- **PUT** `/post/:post_id` - Update a post

### Comments API (Full CRUD)
- **POST** `/comment` - Create a new comment
- **GET** `/comment` - Get all comments
- **GET** `/comment/:comment_id` - Get a comment by ID
- **GET** `/comment?post=<post_id>` - Get all comments for a specific post
- **PUT** `/comment/:comment_id` - Update a comment
- **DELETE** `/comment/:comment_id` - Delete a comment

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB (local or MongoDB Atlas account)

See `MONGODB_SETUP.md` for detailed MongoDB setup instructions.

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and add your MongoDB connection string.

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Testing the API

All API requests are documented in the `request.rest` file. You can use this file with REST Client extensions to test the endpoints.

Alternatively, you can use curl

## Project Structure

```
rest-api-project/
├── server.js              # Main server file
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   ├── Post.js           # Post Mongoose model
│   └── Comment.js        # Comment Mongoose model
├── routes/
│   ├── posts.js          # Posts routes
│   └── comments.js       # Comments routes
├── controllers/
│   ├── postsController.js    # Posts business logic
│   └── commentsController.js # Comments business logic
├── data/
│   └── store.js          # Legacy in-memory store (not used with MongoDB)
├── request.rest          # API request documentation
├── .env.example          # Environment variables template
├── package.json
└── README.md
```

## Data Models

### Post
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Post Title",
  "content": "Post content",
  "sender": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Comment
```json
{
  "id": "507f1f77bcf86cd799439012",
  "content": "Comment content",
  "postId": "507f1f77bcf86cd799439011",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** IDs are now MongoDB ObjectIds (strings), not integers.

## Collaboration

This project uses Git for version control. When working collaboratively:
1. Create a feature branch for your changes
2. Implement your assigned endpoints
3. Submit a pull request for review
4. Merge after approval

## Database

This project uses **MongoDB** with Mongoose ODM. Data is persisted in MongoDB and will survive server restarts.

- For local development, install MongoDB locally or use MongoDB Atlas (free tier available)
- See `MONGODB_SETUP.md` for detailed setup instructions
- Connection string is configured in `.env` file

