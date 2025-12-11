const { posts } = require('../data/store');

const getPosts = (req, res) => {
  res.json(posts);
};

const getPostById = (req, res) => {
  const postId = parseInt(req.params.post_id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
};

const getPostsBySender = (req, res) => {
  const senderId = parseInt(req.query.sender);
  const filteredPosts = posts.filter(p => p.sender === senderId);
  res.json(filteredPosts);
};

const addPost = (req, res) => {
  const { title, content, sender } = req.body;
  
  if (!title || !content || sender === undefined) {
    return res.status(400).json({ error: 'Missing required fields: title, content, sender' });
  }
  
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    title,
    content,
    sender: parseInt(sender),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
};

const updatePost = (req, res) => {
  const postId = parseInt(req.params.post_id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const { title, content, sender } = req.body;
  
  if (title !== undefined) posts[postIndex].title = title;
  if (content !== undefined) posts[postIndex].content = content;
  if (sender !== undefined) posts[postIndex].sender = parseInt(sender);
  posts[postIndex].updatedAt = new Date().toISOString();
  
  res.json(posts[postIndex]);
};

module.exports = {
  getPosts,
  getPostById,
  getPostsBySender,
  addPost,
  updatePost
};

