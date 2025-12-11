
// In-memory data store for posts and comments
// In a production environment, this would be replaced with a database
const posts = [
  {
    id: 1,
    title: 'Sample Post 1',
    content: 'This is the content of the first post',
    sender: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Sample Post 2',
    content: 'This is the content of the second post',
    sender: 2,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }
];

const comments = [
  {
    id: 1,
    content: 'This is a comment on post 1',
    postId: 1,
    userId: 2,
    createdAt: '2024-01-01T01:00:00.000Z',
    updatedAt: '2024-01-01T01:00:00.000Z'
  },
  {
    id: 2,
    content: 'Another comment on post 1',
    postId: 1,
    userId: 3,
    createdAt: '2024-01-01T02:00:00.000Z',
    updatedAt: '2024-01-01T02:00:00.000Z'
  }
];

module.exports = {
  posts,
  comments
};

