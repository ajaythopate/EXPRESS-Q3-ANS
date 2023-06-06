const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Blog = mongoose.model('Blog', blogSchema);

app.use(express.json());

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/blogs', async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content });
    const savedBlog = await blog.save();
    res.json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.put('/blogs/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(deletedBlog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
