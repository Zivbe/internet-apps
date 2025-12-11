const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

// Use routes
app.use('/post', postsRoutes);
app.use('/comment', commentsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'REST API for Posts and Comments' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

