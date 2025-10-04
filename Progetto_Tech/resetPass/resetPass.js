async function resetPassword() {
  const token = document.getElementById("token").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageEl = document.getElementById("message");

  if (newPassword !== confirmPassword) {
    messageEl.style.color = "red";
    messageEl.innerText = "Le password non coincidono!";
    return;
  }

  const response = await fetch("http://127.0.0.1:5000/auth/reset-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ reset_token: token, new_password: newPassword }),
});

  const data = await response.json();
  if (response.ok) {
    messageEl.style.color = "green";
    messageEl.innerText = data.message;

    // Reindirizza a login.html dopo 2 secondi
      setTimeout(() => {
        window.location.href = "../login/login.html"; // aggiorna il percorso se necessario
      }, 1500);
  } else {
    messageEl.style.color = "red";
    messageEl.innerText = data.error;
  }
}