const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const comments = [];

app.get("/api/comments", (req, res) => {
  const { since = -Infinity } = req.query;
  const commentsSince = comments.filter((comment) => comment.createdAt >= since);
  res.send({ comments: commentsSince, until: Date.now() });
});

app.post("/api/comments", (req, res) => {
  const comment = { createdAt: Date.now(), body: req.body.body };
  comments.push(comment);
  res.status(201).send();
});

app.listen(8080, () => console.log("Server started"));
