// Module imports.

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

// Setting up imports for use.

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// mongoose.connect("mongodb+srv://cekstedt:" + process.env.MONGO_PW + "@cluster0.13jgzo4.mongodb.net/todolistDB");
mongoose.connect("mongodb://localhost:27017/blogDB");

// Global Variables.

const PORT = process.env.PORT;

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

// GET routes.

app.get("/", function(req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: []
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

// app.get("/posts/:postName", function(req, res) {
//   const foundPost = _.find(posts, function(post) {
//     return _.lowerCase(post.title) === _.lowerCase(req.params.postName);
//   });
//
//   if (foundPost) {
//     res.render("post", {
//       postTitle: post.title,
//       postContent: post.content
//     });
//   } else {
//     res.status(404).render("404");
//   };
// });

// POST routes.

app.post("/compose", function(req, res) {
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  newPost.save();
  res.redirect("/");
});

// Handle 404 requests.

app.all("*", function(req, res) {
  res.status(404).render("404");
});

// Initialize server.

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});