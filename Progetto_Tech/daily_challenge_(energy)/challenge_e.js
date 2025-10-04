document.addEventListener("DOMContentLoaded", () => {
    loadGlobalProgress(); // Carica lo stato globale dal localStorage
    loadChallengeStates(); // Carica gli stati locali di questa pagina
    const percentage = synchronizeGlobalProgress(); // Sincronizza e calcola la percentuale complessiva

    // Aggiorna la visualizzazione della percentuale, se necessario
    updatePercentageDisplay(percentage);
});

function areAllChallengesCompleted() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    return Array.from(checkboxes).every(checkbox => checkbox.checked);
}

// Salva lo stato di un checkbox
function saveChallengeState(checkbox) {
    ecoChallengeProgress.states.challengeEStates = ecoChallengeProgress.states.challengeEStates || {};
    ecoChallengeProgress.states.challengeEStates[checkbox.id] = checkbox.checked;
    localStorage.setItem("ecoChallengeProgress", JSON.stringify(ecoChallengeProgress));

    if (areAllChallengesCompleted()) {
        localStorage.setItem("allChallengesCompleted", true);
    } else {
        localStorage.removeItem("allChallengesCompleted");
    }

    // Sincronizza il progresso globale
    const percentage = synchronizeGlobalProgress();
    updatePercentageDisplay(percentage);
}

// Carica lo stato dei checkbox
function loadChallengeStates() {
    const savedProgress = JSON.parse(localStorage.getItem("ecoChallengeProgress")) || ecoChallengeProgress;

    // Ripristina lo stato dei checkbox per questa pagina
    const states = savedProgress.states.challengeEStates || {};
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

