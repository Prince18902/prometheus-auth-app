const API = "http://localhost:8080";          // backend base URL
const card = document.getElementById("card");

function renderForm(type = "login") {
  card.innerHTML = `
    <h2 class="mb-4 text-xl font-bold">${type === "login" ? "Login" : "Sign Up"}</h2>
    <input id="name" placeholder="Name" class="input" ${type === "login" ? 'style="display:none"' : ""}/>
    <input id="email" placeholder="Email" class="input"/>
    <input id="pwd" type="password" placeholder="Password" class="input"/>
    <button id="submit" class="btn">${type}</button>
    <p class="mt-2 text-sm">
      ${type === "login" ? "No account?" : "Have an account?"}
      <a href="#" id="toggle" class="text-blue-500 underline">${type === "login" ? "Sign Up" : "Login"}</a>
    </p>
  `;

  document.getElementById("toggle").onclick = e => {
    e.preventDefault();
    renderForm(type === "login" ? "signup" : "login");
  };

  document.getElementById("submit").onclick = async () => {
    const body = {
      name:  document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("pwd").value
    };
    const res = await fetch(`${API}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(r => r.json());

    res.error ? alert(res.error) : showProfile(res.user);
  };
}

function showProfile(user) {
  card.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Welcome, ${user.name}</h2>
    <p><strong>Email:</strong> ${user.email}</p>
    <button class="btn mt-6" onclick="renderForm('login')">Log out</button>
  `;
}

renderForm();   // initial view

// Tailwind helper classes
const style = document.createElement("style");
style.textContent = `
.input{ @apply mb-2 w-full border p-2 rounded }
.btn{ @apply bg-blue-600 text-white w-full py-2 rounded mt-2 }
`;
document.head.append(style);