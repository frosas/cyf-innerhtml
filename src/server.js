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
  res.send({ comments });
});

app.post("/api/comments", (req, res) => {
  const { comment } = req.body;
  comments.push(comment);
  res.status(201).send({});
});

const s = app.listen(8080, () => console.log("Server started"));
