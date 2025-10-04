async function forgotPassword() {
    const email = document.getElementById("email").value;
    const messageEl = document.getElementById("message");

    const response = await fetch("http://127.0.0.1:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
        messageEl.style.color = "green";
        // Mostriamo il link cliccabile alla pagina di reset
        messageEl.innerHTML = `
            ${data.message} <br>
            Your token: <strong>${data.reset_token}</strong> <br>
            <a href="../resetPass/resetPass.html?token=${data.reset_token}">Go to reset page</a>
        `;
    } else {
        messageEl.style.color = "red";
        messageEl.innerText = data.error;
    }
}