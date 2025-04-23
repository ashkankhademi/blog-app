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

// Set EJS as view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (like main.css)
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* ROUTES */

// Redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Handle login form (placeholder logic)
app.post("/login", (req, res) => {
  // Authentication logic will be added later
  res.redirect("/blog");
});

// Signup page
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// Handle signup form (placeholder logic)
app.post("/signup", (req, res) => {
  // You'll add database logic here later
  console.log("Signup data:", req.body);
  res.redirect("/login");
});

// Blog home page
app.get("/blog", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// New post form
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Edit post form
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

// Create post
app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Update post
app.post("/api/posts/:id", async (req, res) => {
  try {
    await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});




