let selectedRating = 0;

// ---- GESTIONE STELLE ----
document.querySelectorAll("#formStars .star").forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    document.querySelectorAll("#formStars .star").forEach(s => s.classList.remove("selected"));
    star.classList.add("selected");
    let prev = star.previousElementSibling;
    while (prev) {
      prev.classList.add("selected");
      prev = prev.previousElementSibling;
    }
  });
});

// ---- INVIO FEEDBACK ----
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const messageEl = document.getElementById("message");

  const title = titleEl.value.trim();
  const description = descEl.value.trim();

  if (selectedRating === 0) {
    messageEl.style.color = "red";
    messageEl.textContent = "⚠️ Seleziona una valutazione con le stelle.";
    return;
  }

  const response = await fetch("http://127.0.0.1:5000/auth/feedbacks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, rating: selectedRating })
  });

  const data = await response.json();
  console.log(data);

  if (response.ok) {
    messageEl.style.color = "green";
    messageEl.textContent = "✅ Recensione aggiunta correttamente!";
    titleEl.value = "";
    descEl.value = "";
    selectedRating = 0;
    document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
    setTimeout(() => messageEl.textContent = "", 3000);
    loadFeedbacks(); // aggiorna elenco
  } else {
    messageEl.style.color = "red";
    messageEl.textContent = data.error;
  }
});

// ---- MOSTRA FEEDBACKS ----
async function loadFeedbacks() {
  const messageEl = document.getElementById("message");
  messageEl.style.color = "black";
  messageEl.textContent = "Caricamento recensioni...";

  try {
    const response = await fetch("http://127.0.0.1:5000/auth/feedbacks");

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const feedbacks = data; // perché il server restituisce già un array

    const listContainer = document.getElementById("feedbackList");
    listContainer.innerHTML = ""; // svuota tutto 

    if (feedbacks.length === 0) {
  const emptyMsg = document.createElement("p");
  emptyMsg.textContent = "No reviews… yet!";
  emptyMsg.style.color = "gray";
  emptyMsg.style.textAlign = "center";
  listContainer.appendChild(emptyMsg);
} else {
  feedbacks.forEach(fb => {
  const card = document.createElement("div");
    card.classList.add("feedback-card");

    const titleEl = document.createElement("h3");
    titleEl.textContent = fb.title;

    const descEl = document.createElement("p");
    descEl.textContent = fb.description;

    const starsEl = document.createElement("p");
    starsEl.classList.add("stars-display");

    // Genera le 5 stelle
    const totalStars = 5;
    let starsHTML = "";
    for (let i = 1; i <= totalStars; i++) {
      if (i <= Number(fb.rating)) {
        starsHTML += '<span class="star selected">★</span>';
      } else {
        starsHTML += '<span class="star">★</span>';
      }
    }
    starsEl.innerHTML = starsHTML;

    card.appendChild(titleEl);
    card.appendChild(descEl);
    card.appendChild(starsEl);

    listContainer.prepend(card); // recensioni più recenti in cima
  });
}

    messageEl.textContent = ""; // svuota messaggio di caricamento

  } catch (error) {
    console.error(error);
    messageEl.style.color = "red";
    messageEl.textContent = "Errore durante il caricamento delle recensioni";
  }
}

// Carica all’avvio
loadFeedbacks();