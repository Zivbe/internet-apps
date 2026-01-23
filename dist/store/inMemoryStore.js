"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRefreshToken = exports.findRefreshToken = exports.addRefreshToken = exports.deleteComment = exports.updateComment = exports.createComment = exports.findCommentById = exports.getComments = exports.deletePost = exports.updatePost = exports.createPost = exports.findPostById = exports.getPosts = exports.deleteUser = exports.updateUser = exports.createUser = exports.findUserByEmail = exports.findUserById = exports.getUsers = exports.resetStore = void 0;
const uuid_1 = require("uuid");
const users = [];
const posts = [];
const comments = [];
const refreshTokens = [];
const now = () => new Date().toISOString();
const resetStore = () => {
    users.length = 0;
    posts.length = 0;
    comments.length = 0;
    refreshTokens.length = 0;
};
exports.resetStore = resetStore;
const getUsers = () => [...users];
exports.getUsers = getUsers;
const findUserById = (id) => users.find((user) => user.id === id);
exports.findUserById = findUserById;
const findUserByEmail = (email) => users.find((user) => user.email.toLowerCase() === email.toLowerCase());
exports.findUserByEmail = findUserByEmail;
const createUser = (data) => {
    const timestamp = now();
    const user = {
        id: (0, uuid_1.v4)(),
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    users.push(user);
    return user;
};
exports.createUser = createUser;
const updateUser = (id, updates) => {
    const user = (0, exports.findUserById)(id);
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
exports.updateUser = updateUser;
const deleteUser = (id) => {
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
exports.deleteUser = deleteUser;
const getPosts = (authorId) => {
    const result = authorId ? posts.filter((post) => post.authorId === authorId) : posts;
    return [...result];
};
exports.getPosts = getPosts;
const findPostById = (id) => posts.find((post) => post.id === id);
exports.findPostById = findPostById;
const createPost = (data) => {
    const timestamp = now();
    const post = {
        id: (0, uuid_1.v4)(),
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    posts.push(post);
    return post;
};
exports.createPost = createPost;
const updatePost = (id, updates) => {
    const post = (0, exports.findPostById)(id);
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
exports.updatePost = updatePost;
const deletePost = (id) => {
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
exports.deletePost = deletePost;
const getComments = (postId) => {
    const result = postId ? comments.filter((comment) => comment.postId === postId) : comments;
    return [...result];
};
exports.getComments = getComments;
const findCommentById = (id) => comments.find((comment) => comment.id === id);
exports.findCommentById = findCommentById;
const createComment = (data) => {
    const timestamp = now();
    const comment = {
        id: (0, uuid_1.v4)(),
        content: data.content,
        postId: data.postId,
        authorId: data.authorId,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    comments.push(comment);
    return comment;
};
exports.createComment = createComment;
const updateComment = (id, updates) => {
    const comment = (0, exports.findCommentById)(id);
    if (!comment) {
        return null;
    }
    if (updates.content !== undefined) {
        comment.content = updates.content;
    }
    comment.updatedAt = now();
    return comment;
};
exports.updateComment = updateComment;
const deleteComment = (id) => {
    const commentIndex = comments.findIndex((comment) => comment.id === id);
    if (commentIndex === -1) {
        return false;
    }
    comments.splice(commentIndex, 1);
    return true;
};
exports.deleteComment = deleteComment;
const addRefreshToken = (entry) => {
    refreshTokens.push(entry);
};
exports.addRefreshToken = addRefreshToken;
const findRefreshToken = (tokenHash) => refreshTokens.find((entry) => entry.tokenHash === tokenHash);
exports.findRefreshToken = findRefreshToken;
const removeRefreshToken = (tokenHash) => {
    const index = refreshTokens.findIndex((entry) => entry.tokenHash === tokenHash);
    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }
};
exports.removeRefreshToken = removeRefreshToken;
