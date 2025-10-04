document.addEventListener("DOMContentLoaded", () => {
    loadGlobalProgress(); // Carica lo stato globale dal localStorage
    loadChallengeStates(); // Carica gli stati locali di questa pagina
    const percentage = synchronizeGlobalProgress(); // Sincronizza e calcola la percentuale complessiva

    // Aggiorna la visualizzazione della percentuale, se necessario
    updatePercentageDisplay(percentage);
});

// Funzione per salvare lo stato di un checkbox
function saveChallengeState(checkbox) {
    ecoChallengeProgress.states.challengeEStates = ecoChallengeProgress.states.challengeEStates || {};
    ecoChallengeProgress.states.challengeTStates[checkbox.id] = checkbox.checked;
    localStorage.setItem("ecoChallengeProgress", JSON.stringify(ecoChallengeProgress));

    // Sincronizza il progresso globale
    const percentage = synchronizeGlobalProgress();
    updatePercentageDisplay(percentage);
}

// Funzione per caricare lo stato dei checkbox
function loadChallengeStates() {
    const savedProgress = JSON.parse(localStorage.getItem("ecoChallengeProgress")) || ecoChallengeProgress;

    // Ripristina lo stato dei checkbox
    const states = savedProgress.states.challengeTStates || {};
    for (const [id, checked] of Object.entries(states)) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checked;
        }
    }
}

// Funzione per aggiornare la visualizzazione della percentuale (opzionale)
function updatePercentageDisplay(percentage) {
    const percentageElement = document.querySelector(".percentage-display");
    if (percentageElement) {
        percentageElement.textContent = `${percentage}%`;
    }
}
