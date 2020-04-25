let commentsUpdatedAt;

function loadNewComments() {
  const queryParams = new URLSearchParams();
  if (commentsUpdatedAt) queryParams.set("since", commentsUpdatedAt);
  return fetch(`/api/comments?${queryParams}`)
    .then((res) => res.json())
    .then(({ comments, date }) => {
      commentsUpdatedAt = date;
      return comments;
    });
}

function renderComments(comments) {
  const commentsEl = document.querySelector("#comments");
  comments.forEach((comment) => {
    commentsEl.insertBefore(createCommentEl(comment), commentsEl.firstChild);
  });
}

function createCommentEl(comment) {
  const commentTemplateEl = document.querySelector("#comment-template");
  const el = document.importNode(commentTemplateEl.content, true);
  // el.querySelector(".comment--body").textContent = comment;
  el.querySelector(".comment--body").innerHTML = comment.body;
  return el;
}

function updateComments() {
  return loadNewComments().then(renderComments);
}

(function setupCommentForm() {
  const formEl = document.querySelector("#comment-form");
  const inputEl = formEl.querySelector("input");
  inputEl.focus();
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = inputEl.value;
    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    }).then(() => {
      formEl.reset();
      updateComments();
    });
  });
})();

(function updateCommentsPeriodically() {
  updateComments().then(() => setTimeout(updateCommentsPeriodically, 1000));
})();
