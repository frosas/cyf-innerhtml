function loadComments() {
  return fetch("/api/comments")
    .then((res) => res.json())
    .then((body) => body.comments.reverse());
}

function renderComments(comments) {
  const commentsEl = document.querySelector("#comments");
  commentsEl.innerHTML = "";
  comments.forEach((comment) => {
    commentsEl.appendChild(createCommentEl(comment));
  });
}

function createCommentEl(comment) {
  const commentTemplateEl = document.querySelector("#comment-template");
  const el = document.importNode(commentTemplateEl.content, true);
  // el.querySelector(".comment--body").textContent = comment;
  el.querySelector(".comment--body").innerHTML = comment;
  return el;
}

function updateComments() {
  return loadComments().then(renderComments);
}

(function setupCommentForm() {
  const formEl = document.querySelector("#comment-form");
  const inputEl = formEl.querySelector("input");
  inputEl.focus();
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const comment = inputEl.value;
    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    }).then(() => {
      formEl.reset();
      updateComments();
    });
  });
})();

(function updateCommentsPeriodically() {
  updateComments().then(() => setTimeout(updateCommentsPeriodically, 1000));
})();
