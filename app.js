// Module imports.

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const ejs = require("ejs");

// Setting up imports for use.

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(process.env.MONGO_DB + "/blogDB");

// Global Variables.

const PORT = process.env.PORT;

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

// GET routes.

app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { posts: foundPosts });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:postID", function(req, res) {
  Post.findById(req.params.postID, function(err, foundPost) {
    if (err) {
      if (err.name === "BSONTypeError" || err.name === "CastError") {
        res.status(404).render("404");
      } else {
        console.log(err);
      }
    } else if (foundPost) {
      res.render("post", {
        postTitle: foundPost.title,
        postContent: foundPost.content
      });
    } else {
      res.status(404).render("404");
    };
  });
});

// POST routes.

app.post("/compose", function(req, res) {
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  newPost.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// Handle 404 requests.

app.all("*", function(req, res) {
  res.status(404).render("404");
});

// Initialize server.

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});