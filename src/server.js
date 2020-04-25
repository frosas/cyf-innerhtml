const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

let comments = [];

app.get("/reset", (req, res) => {
  comments = [];
  res.redirect("/");
});

app.get("/api/comments", (req, res) => {
  const { since = -Infinity } = req.query;
  const newComments = comments.filter((comment) => comment.createdAt >= since);
  res.send({ comments: newComments, date: Date.now() });
});

app.post("/api/comments", (req, res) => {
  const { body } = req.body;
  const comment = { createdAt: Date.now(), body };
  comments.push(comment);
  res.status(201).send({});
});

app.listen(8080, () => console.log("Server started"));
