const express = require('express');
const bodyParser = require('body-parser');

const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

// Get all posts
app.get('/posts', async (req, res) => {
	const storedPosts = await getStoredPosts();
	res.json({ posts: storedPosts });
});

// Create a new post
app.post('/posts', async (req, res) => {
	const { author, body } = req.body;

	if (!author || !body) {
		return res.status(400).json({ message: 'Author and body are required' });
	}

	const storedPosts = await getStoredPosts();
	const newPost = {
		id: Math.random().toString(36).substring(2, 9), // Generate unique ID
		author,
		body
	};

	const updatedPosts = [newPost, ...storedPosts];
	await storePosts(updatedPosts);

	res.status(201).json({ message: 'Stored new post.', post: newPost });
});

// **Fix: Edit a Post**
app.put('/posts/:id', async (req, res) => {
	const { body } = req.body;
	const postId = req.params.id;

	if (!body) {
		return res.status(400).json({ message: 'Body text is required' });
	}

	const storedPosts = await getStoredPosts();
	const postIndex = storedPosts.findIndex((post) => post.id === postId);

	if (postIndex === -1) {
		return res.status(404).json({ message: 'Post not found' });
	}

	storedPosts[postIndex].body = body; // Update only body text

	await storePosts(storedPosts);

	res.status(200).json({ message: 'Post updated successfully', post: storedPosts[postIndex] });
});

// **Fix: Delete a Post**
app.delete('/posts/:id', async (req, res) => {
	const postId = req.params.id;
	let storedPosts = await getStoredPosts();

	// Filter out the deleted post
	const updatedPosts = storedPosts.filter((post) => post.id !== postId);

	if (updatedPosts.length === storedPosts.length) {
		return res.status(404).json({ message: 'Post not found' });
	}

	await storePosts(updatedPosts);

	res.status(200).json({ message: 'Post deleted successfully' });
});

module.exports = app; // ✅ Correct export for `index.js`

