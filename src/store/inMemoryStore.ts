import { v4 as uuid } from 'uuid';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenEntry {
  tokenHash: string;
  userId: string;
  expiresAt: string;
}

const users: User[] = [];
const posts: Post[] = [];
const comments: Comment[] = [];
const refreshTokens: RefreshTokenEntry[] = [];

const now = () => new Date().toISOString();

export const resetStore = () => {
  users.length = 0;
  posts.length = 0;
  comments.length = 0;
  refreshTokens.length = 0;
};

export const getUsers = () => [...users];

export const findUserById = (id: string) => users.find((user) => user.id === id);

export const findUserByEmail = (email: string) =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const createUser = (data: {
  username: string;
  email: string;
  passwordHash: string;
}) => {
  const timestamp = now();
  const user: User = {
    id: uuid(),
    username: data.username,
    email: data.email,
    passwordHash: data.passwordHash,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  users.push(user);
  return user;
};

export const updateUser = (
  id: string,
  updates: Partial<Pick<User, 'username' | 'email' | 'passwordHash'>>
) => {
  const user = findUserById(id);
  if (!user) {
    return null;
  }
  if (updates.username !== undefined) {
    user.username = updates.username;
  }
  if (updates.email !== undefined) {
    user.email = updates.email;
  }
  if (updates.passwordHash !== undefined) {
    user.passwordHash = updates.passwordHash;
  }
  user.updatedAt = now();
  return user;
};

export const deleteUser = (id: string) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return false;
  }
  users.splice(userIndex, 1);

  for (let index = posts.length - 1; index >= 0; index -= 1) {
    if (posts[index].authorId === id) {
      const postId = posts[index].id;
      posts.splice(index, 1);
      for (let commentIndex = comments.length - 1; commentIndex >= 0; commentIndex -= 1) {
        if (comments[commentIndex].postId === postId) {
          comments.splice(commentIndex, 1);
        }
      }
    }
  }

  for (let index = comments.length - 1; index >= 0; index -= 1) {
    if (comments[index].authorId === id) {
      comments.splice(index, 1);
    }
  }

  for (let index = refreshTokens.length - 1; index >= 0; index -= 1) {
    if (refreshTokens[index].userId === id) {
      refreshTokens.splice(index, 1);
    }
  }
  return true;
};

export const getPosts = (authorId?: string) => {
  const result = authorId ? posts.filter((post) => post.authorId === authorId) : posts;
  return [...result];
};

export const findPostById = (id: string) => posts.find((post) => post.id === id);

export const createPost = (data: { title: string; content: string; authorId: string }) => {
  const timestamp = now();
  const post: Post = {
    id: uuid(),
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  posts.push(post);
  return post;
};

export const updatePost = (id: string, updates: Partial<Pick<Post, 'title' | 'content'>>) => {
  const post = findPostById(id);
  if (!post) {
    return null;
  }
  if (updates.title !== undefined) {
    post.title = updates.title;
  }
  if (updates.content !== undefined) {
    post.content = updates.content;
  }
  post.updatedAt = now();
  return post;
};

export const deletePost = (id: string) => {
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return false;
  }
  posts.splice(postIndex, 1);
  for (let index = comments.length - 1; index >= 0; index -= 1) {
    if (comments[index].postId === id) {
      comments.splice(index, 1);
    }
  }
  return true;
};

export const getComments = (postId?: string) => {
  const result = postId ? comments.filter((comment) => comment.postId === postId) : comments;
  return [...result];
};

export const findCommentById = (id: string) => comments.find((comment) => comment.id === id);

export const createComment = (data: {
  content: string;
  postId: string;
  authorId: string;
}) => {
  const timestamp = now();
  const comment: Comment = {
    id: uuid(),
    content: data.content,
    postId: data.postId,
    authorId: data.authorId,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  comments.push(comment);
  return comment;
};

export const updateComment = (id: string, updates: Partial<Pick<Comment, 'content'>>) => {
  const comment = findCommentById(id);
  if (!comment) {
    return null;
  }
  if (updates.content !== undefined) {
    comment.content = updates.content;
  }
  comment.updatedAt = now();
  return comment;
};

export const deleteComment = (id: string) => {
  const commentIndex = comments.findIndex((comment) => comment.id === id);
  if (commentIndex === -1) {
    return false;
  }
  comments.splice(commentIndex, 1);
  return true;
};

export const addRefreshToken = (entry: RefreshTokenEntry) => {
  refreshTokens.push(entry);
};

export const findRefreshToken = (tokenHash: string) =>
  refreshTokens.find((entry) => entry.tokenHash === tokenHash);

export const removeRefreshToken = (tokenHash: string) => {
  const index = refreshTokens.findIndex((entry) => entry.tokenHash === tokenHash);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }
};

