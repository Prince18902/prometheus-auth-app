/* ---------- CONFIG ---------- */
// use the same origin the page was served from
const API = "https://prometheus-auth-app.onrender.com";      // change to Render URL when deployed
const card = document.getElementById("card");

/* ---------- Tailwind helper classes (injected once) ---------- */
const style = document.createElement("style");
style.textContent = `
.card{
  @apply w-[22rem] rounded-2xl shadow-xl bg-white/80 backdrop-blur p-8;
}
.input{
  @apply mb-3 w-full border border-slate-300 p-2 rounded
         focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn{
  @apply bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2
         rounded font-semibold disabled:bg-blue-300;
}
.banner{
  @apply w-full text-center rounded p-2 mb-3;
}
.banner-success{ @apply bg-emerald-100 text-emerald-800 border border-emerald-300; }
.banner-error  { @apply bg-red-100     text-red-800     border border-red-300; }
`;
document.head.append(style);

/* ---------- UI helpers ---------- */
function showBanner(msg, type){
  const div = document.createElement("div");
  div.className = `banner ${type==='error' ? 'banner-error' : 'banner-success'}`;
  div.textContent = msg;
  card.prepend(div);
  setTimeout(()=>div.remove(), 4000);
}

/* ---------- Renderers ---------- */
function renderForm(mode="login"){
  card.innerHTML = `
    <h2 class="mb-4 text-xl font-bold text-slate-800">
      ${mode==='login' ? 'Login' : 'Sign&nbsp;Up'}
    </h2>
    ${mode==='signup'
        ? '<input id="name"  placeholder="Name"  class="input"/>'
        : ''}
    <input id="email" placeholder="Email" class="input"/>
    <input id="pwd"   type="password" placeholder="Password" class="input"/>
    <button id="submit" class="btn" disabled>
      ${mode==='login' ? 'Login' : 'Sign&nbsp;Up'}
    </button>
    <p class="mt-2 text-sm text-slate-600">
      ${mode==='login' ? "Don't have an account?" : "Already registered?"}
      <a href="#" id="toggle" class="text-blue-600 underline">
        ${mode==='login' ? "Sign&nbsp;Up" : "Login"}
      </a>
    </p>
  `;

  // toggle link
  card.querySelector("#toggle").onclick = e=>{
    e.preventDefault();
    renderForm(mode==='login' ? 'signup' : 'login');
  };

  // enable/disable button when all fields filled
  card.querySelectorAll(".input").forEach(i=>{
    i.oninput = ()=>{
      const filled = [...card.querySelectorAll(".input")]
        .every(inp=>inp.value.trim());
      card.querySelector("#submit").disabled = !filled;
    };
  });

  // submit handler
  card.querySelector("#submit").onclick = async ()=>{
    const body = {
      name:  card.querySelector("#name")?.value,
      email: card.querySelector("#email").value,
      password: card.querySelector("#pwd").value
    };
    const resp = await fetch(`${API}/${mode}`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(body)
    }).then(r=>r.json());

    resp.error
      ? showBanner(resp.error,'error')
      : (showBanner(`Welcome, ${resp.user.name}!`,'success'),
         showProfile(resp.user));
  };
}

function showProfile(user){
  card.innerHTML = `
    <h2 class="text-xl font-bold text-slate-800 mb-4">Welcome, ${user.name}</h2>
    <p class="mb-1"><strong>Email:</strong> ${user.email}</p>
    <button class="btn mt-6" onclick="renderForm('login')">Log&nbsp;out</button>
  `;
}

/* ---------- Init ---------- */
renderForm();