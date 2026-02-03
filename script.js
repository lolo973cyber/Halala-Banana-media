let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};
let posts = JSON.parse(localStorage.getItem("posts")) || [];

function save() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
}

function login() {
  const name = document.getElementById("username").value.trim();
  const avatar = document.getElementById("avatar").value;

  if (!name) return alert("Enter a name");

  if (!users[name]) {
    users[name] = { avatar, following: [] };
  }

  currentUser = name;
  save();

  document.getElementById("user-name").innerText =
    users[name].avatar + " " + name;

  document.getElementById("login-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";

  renderFeed();
}

function addPost() {
  const text = document.getElementById("post-text").value.trim();
  if (!text) return;

  posts.unshift({
    user: currentUser,
    text,
    likes: 0,
    comments: []
  });

  document.getElementById("post-text").value = "";
  save();
  renderFeed();
}

function likePost(i) {
  posts[i].likes++;
  save();
  renderFeed();
}

function follow(user) {
  const f = users[currentUser].following;
  if (!f.includes(user)) f.push(user);
  save();
  renderFeed();
}

function addComment(i) {
  const input = document.getElementById("c" + i);
  if (!input.value.trim()) return;

  posts[i].comments.push({
    user: currentUser,
    text: input.value
  });

  input.value = "";
  save();
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "post";

    let followBtn = "";
    if (p.user !== currentUser &&
        !users[currentUser].following.includes(p.user)) {
      followBtn = `<button onclick="follow('${p.user}')">Follow</button>`;
    }

    div.innerHTML = `
      <strong>${users[p.user].avatar} ${p.user}</strong>
      ${followBtn}
      <p>${p.text}</p>
      <button onclick="likePost(${i})">❤️ ${p.likes}</button>

      <div>
        ${p.comments.map(c =>
          `<div><b>${c.user}:</b> ${c.text}</div>`
        ).join("")}
      </div>

      <input id="c${i}" placeholder="Comment">
      <button onclick="addComment(${i})">Send</button>
    `;

    feed.appendChild(div);
  });
}
