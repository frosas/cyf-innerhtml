function loadNewComments(since) {
  const queryParams = new URLSearchParams();
  if (since) queryParams.set("since", since);
  return fetch(`/api/comments?${queryParams}`).then((res) => res.json());
}

function createCommentEl(comment) {
  const el = document.createElement("div");
  el.className = "comment";
  el.innerHTML = `<p>${comment.body}</p>`;
  return el;
}

function addCommentsEls(comments) {
  const commentsEl = document.querySelector("#comments");
  comments.forEach((comment) => {
    const el = createCommentEl(comment);
    commentsEl.insertBefore(el, commentsEl.firstChild);
  });
}

let since;
let currentUpdateCommentsId = 0;

function updateComments() {
  const id = ++currentUpdateCommentsId;
  return loadNewComments(since).then(({ comments, until }) => {
    if (id === currentUpdateCommentsId) {
      since = until;
      addCommentsEls(comments);
    }
  });
}

(function updateCommentsPeriodically() {
  updateComments().then(() => setTimeout(updateCommentsPeriodically, 1000));
})();

function postComment(comment) {
  return fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
}

(function setupCommentForm() {
  const formEl = document.querySelector("#comment-form");
  const inputEl = formEl.querySelector("input");
  inputEl.focus();
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const comment = { body: inputEl.value };
    postComment(comment).then(updateComments);
    formEl.reset();
  });
})();
