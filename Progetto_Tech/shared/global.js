const ecoChallengeProgress = {
    totalChallenges: 19, // Totale sfide in tutte le pagine
    completedChallenges: 0, // Sfide completate globalmente
    states: {
        challengeFStates: {}, // Stato dei checkbox di challenge_f.html
        challengeTStates: {}, // Stato dei checkbox di challenge_t.html
        challengeEStates: {}, // Stato dei checkbox di challenge_e.html
    },
};

// Funzione per sincronizzare il progresso globale
function synchronizeGlobalProgress() {
    let completedChallenges = 0;

    // Conta le sfide completate in challengeFStates
    for (const checked of Object.values(ecoChallengeProgress.states.challengeFStates)) {
        if (checked) completedChallenges++;
    }

    // Conta le sfide completate in challengeTStates
    for (const checked of Object.values(ecoChallengeProgress.states.challengeTStates)) {
        if (checked) completedChallenges++;
    }

    // Conta le sfide completate in challengeEStates
    for (const checked of Object.values(ecoChallengeProgress.states.challengeEStates)) {
        if (checked) completedChallenges++;
    }

    // Aggiorna il contatore globale
    ecoChallengeProgress.completedChallenges = completedChallenges;

    // Calcola la percentuale complessiva (max 25%)
    const percentage = Math.min(
        Math.round((ecoChallengeProgress.completedChallenges / ecoChallengeProgress.totalChallenges) * 25),
        25
    );

    // Salva i dati aggiornati nel localStorage
    localStorage.setItem("ecoChallengePercentage", percentage);
    localStorage.setItem("ecoChallengeProgress", JSON.stringify(ecoChallengeProgress));

    console.log(`Sfide completate globali: ${completedChallenges}/${ecoChallengeProgress.totalChallenges}`);
    console.log(`Percentuale complessiva aggiornata: ${percentage}%`);

    return percentage; // Restituisce la percentuale per l'uso nelle pagine
}

// Funzione per caricare lo stato globale dal localStorage
function loadGlobalProgress() {
    const savedProgress = JSON.parse(localStorage.getItem("ecoChallengeProgress")) || ecoChallengeProgress;

    // Aggiorna lo stato globale
    ecoChallengeProgress.states = savedProgress.states || {};
    ecoChallengeProgress.completedChallenges = savedProgress.completedChallenges || 0;
}
