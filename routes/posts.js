const express = require('express');
const router = express.Router();
const { getPosts, getPostById, getPostsBySender, addPost, updatePost } = require('../controllers/postsController');


router.get('/', (req, res) => {
  if (req.query.sender) {
    getPostsBySender(req, res);
  } else {
    getPosts(req, res);
  }
});

router.get('/:post_id', getPostById);

router.post('/', addPost);

router.put('/:post_id', updatePost);

module.exports = router;

