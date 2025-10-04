document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('nameInput');
  const nameContainer = document.getElementById('nameContainer');

  // Controlla se tutte le challenge sono completate
  const allChallengesCompleted = localStorage.getItem("allChallengesCompleted");
  if (allChallengesCompleted) {
      const firstMedal = document.querySelector(".food-images img:first-child");
      if (firstMedal) {
          firstMedal.classList.add("highlight-medal"); // Aggiungi una classe per l'animazione

          // Rimuovi l'evidenziamento dopo 5 secondi
          setTimeout(() => {
            firstMedal.classList.remove("highlight-medal");
        }, 1000);
      }
  }

  // Funzione per mostrare il nome salvato al caricamento della pagina
  const showSavedName = () => {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
          nameInput.value = savedName;
          nameInput.style.pointerEvents = "none"; // Disabilita l'input cliccabile
          nameInput.disabled = true; // Disabilita l'input per la modifica
      }
  };

  showSavedName();

  // Abilita la modifica cliccando sul contenitore
  nameContainer.addEventListener('click', () => {
      nameInput.disabled = false; // Abilita l'input
      nameInput.style.pointerEvents = "auto"; // Consente l'interazione con l'input
      nameInput.focus(); // Focalizza l'input
      nameInput.select(); // Seleziona il testo per modificarlo facilmente
  });

  // Salva il nome su Enter o quando l'input perde il focus
  const saveName = () => {
      const name = nameInput.value.trim();
      if (name) {
          localStorage.setItem('userName', name); // Salva in localStorage
          nameInput.disabled = true; // Disabilita l'input dopo il salvataggio
          nameInput.style.pointerEvents = "none"; // Rende l'input non cliccabile
      } else {
          alert("Il campo nome non può essere vuoto!");
          nameInput.focus(); // Rimetti il focus per richiedere un nome
      }
  };

  // Salva il nome premendo Enter
  nameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          saveName();
      }
  });

  // Salva il nome quando l'input perde il focus
  nameInput.addEventListener('blur', saveName);
});






//funzione per resettare solamente per fare test (ELIMINARE PRIMA DELLA CONSEGNA)
function resetName() {
  localStorage.removeItem('userName'); // Rimuove il nome salvato
  const nameInput = document.getElementById('nameInput');
  if (nameInput) {
      nameInput.value = ""; // Pulisce il valore dell'input
      nameInput.disabled = false; // Rende l'input nuovamente modificabile
  }
}


document.getElementById('resetNameButton').addEventListener('click', resetName);