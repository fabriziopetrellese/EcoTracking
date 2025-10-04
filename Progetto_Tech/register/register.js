async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageEl = document.getElementById("message");

    const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    // Rimuovi tutte le classi
    messageEl.className = "";

    if (response.ok) {
        messageEl.classList.add("success"); // aggiungi classe success
        messageEl.innerText = data.message;
    } else {
        messageEl.innerText = data.error; // resta rosso
    }
}