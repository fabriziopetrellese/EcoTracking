document.addEventListener("DOMContentLoaded", () => {
    const progressCircle = document.querySelector(".circle span");
    const chart = document.querySelector(".chart");

    let previousPercentage = parseFloat(localStorage.getItem("ecoChallengePercentage")) || 0;

    // Mostra la percentuale nel DOM
    const displayPercentage = (totalImpact) => {
        if (progressCircle) {
            progressCircle.textContent = `${totalImpact}%`;
        }
        if (chart) {
            chart.style.background = `conic-gradient(#4aa463 ${totalImpact}%, #ccc ${totalImpact}% 100%)`;
        }
    };

    // Funzione per aggiornare la percentuale
    const updatePercentage = () => {
        const foodImpact = parseFloat(localStorage.getItem("foodOverallImpact")) || 0;
        const transportImpact = parseFloat(localStorage.getItem("transportOverallImpact")) || 0;
        const energyImpact = parseFloat(localStorage.getItem("energyOverallImpact")) || 0;
        const challengesImpact = parseFloat(localStorage.getItem("ecoChallengePercentage")) || 0;


        let totalImpact = Math.max(0, Math.min(foodImpact + transportImpact + energyImpact - challengesImpact, 100));

        if (previousPercentage !== totalImpact) {
            console.log("Percentuale aggiornata:", totalImpact);
            displayPercentage(totalImpact);
            previousPercentage = totalImpact;
        }
    };

    // Fallback con setInterval per garantire l'aggiornamento
    const intervalId = setInterval(() => {
        updatePercentage();
    }, 100);
});
