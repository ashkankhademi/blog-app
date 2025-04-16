import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

// Fix for __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as view engine and fix views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files like main.css
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* ROUTES */

// Render login page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Handle login form submission (temporary logic)
app.post("/login", (req, res) => {
  // You’ll add authentication here later
  res.redirect("/");
});

// Render main blog page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Render create new post form
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Render edit form with existing post data
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Handle post creation
app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Handle post updates
app.post("/api/posts/:id", async (req, res) => {
  try {
    await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Handle post deletion
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});



