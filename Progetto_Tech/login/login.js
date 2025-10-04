document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva il token nel localStorage
            localStorage.setItem("access_token", data.access_token);

            // Redirigi alla home.html
            window.location.href = "../home/home.html"; // aggiorna percorso se necessario
        } else {
            document.getElementById("message").textContent = data.error;
        }
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "Errore di connessione!";
    }
});
