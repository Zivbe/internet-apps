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

1. Install dependencies:
```bash
npm install


2. Start the server:
```bash
npm start


The server will run on `http://localhost:3000`

## Testing the API

All API requests are documented in the `request.rest` file. You can use this file with REST Client extensions to test the endpoints.

Alternatively, you can use curl

## Project Structure

```
rest-api-project/
├── server.js              # Main server file
├── routes/
│   ├── posts.js          # Posts routes
│   └── comments.js       # Comments routes
├── controllers/
│   ├── postsController.js    # Posts business logic
│   └── commentsController.js # Comments business logic
├── data/
│   └── store.js          # In-memory data store
├── request.rest          # API request documentation
├── package.json
└── README.md
```

## Data Models

### Post
```json
{
  "id": 1,
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
  "id": 1,
  "content": "Comment content",
  "postId": 1,
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Collaboration

This project uses Git for version control. When working collaboratively:
1. Create a feature branch for your changes
2. Implement your assigned endpoints
3. Submit a pull request for review
4. Merge after approval

## Notes

- The current implementation uses an in-memory data store. Data will be lost when the server restarts.
- For production use, replace the in-memory store with a proper database (MongoDB, PostgreSQL, etc.).

