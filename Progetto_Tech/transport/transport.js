// Event listeners per resettare i campi quando si inizia a compilare l'altro tipo di mezzo
document.getElementById('classicVehicle').addEventListener('change', resetGreenVehicleFields);
document.getElementById('duration').addEventListener('input', resetGreenVehicleFields);
document.getElementById('timesUsed').addEventListener('input', resetGreenVehicleFields);

document.getElementById('greenVehicle').addEventListener('change', resetClassicVehicleFields);
document.getElementById('durationGreen').addEventListener('input', resetClassicVehicleFields);
document.getElementById('timesUsedGreen').addEventListener('input', resetClassicVehicleFields);

function resetGreenVehicleFields() {
    document.getElementById('greenVehicle').value = '';
    document.getElementById('durationGreen').value = '';
    document.getElementById('timesUsedGreen').value = '';
}

function resetClassicVehicleFields() {
    document.getElementById('classicVehicle').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('timesUsed').value = '';
}

function addVehicleRow(type, vehicle, duration, timesUsed, save = true) {
    if (!document.getElementById('classicVehicleTableBody') || !document.getElementById('greenVehicleTableBody')) {
        console.error("Element not found: Ensure the table IDs are correctly set in transport.html");
        return;
    }
    if (!vehicle || !duration || !timesUsed) return; // Evita di aggiungere righe vuote

    const tableBodyId = type === 'classic' ? 'classicVehicleTableBody' : 'greenVehicleTableBody';
    const tableBody = document.getElementById(tableBodyId);

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
     
           <button class="remove-button" onclick="removeVehicleRow(this)">-</button>
        
        <td>${vehicle}</td>
        <td>${duration}</td>
        <td>${timesUsed}</td>
    `;

    tableBody.appendChild(newRow);

    if (save) {
        saveToLocalStorage();
    }
}


function removeVehicleRow(button) {
    const row = button.closest('tr');
    row.remove();
    saveToLocalStorage();
}

// Evento per il salvataggio dei dati dal modulo
document.getElementById('transportForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const classicVehicle = document.getElementById('classicVehicle').value;
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const timesUsed = parseInt(document.getElementById('timesUsed').value) || 0;
    const greenVehicle = document.getElementById('greenVehicle').value;
    const durationGreen = parseInt(document.getElementById('durationGreen').value) || 0;
    const timesUsedGreen = parseInt(document.getElementById('timesUsedGreen').value) || 0;

    // Controllo e aggiunta dei veicoli classici
    if (classicVehicle !== "" && duration > 0 && timesUsed > 0) {
        addVehicleRow('classic', classicVehicle, duration, timesUsed); // Aggiunge la riga alla tabella
        resetClassicVehicleFields(); // Reset dei campi
    } else if (classicVehicle !== "") {
        alert("Please complete all fields for Classic Vehicle.");
    }

    // Controllo e aggiunta dei veicoli green
    if (greenVehicle && durationGreen > 0 && timesUsedGreen > 0) {
        addVehicleRow('green', greenVehicle, durationGreen, timesUsedGreen);
        resetGreenVehicleFields('green');
    } else if (greenVehicle) {
        alert('Please complete all fields for Green Vehicle.');
    }

    // Verifica che almeno un campo sia compilato
    if (!classicVehicle && !greenVehicle) {
        alert("Please select a vehicle and fill out the fields.");
    }
});


// Funzione per salvare i dati su Local Storage
function saveToLocalStorage() {
    const classicVehicles = Array.from(document.querySelectorAll('#classicVehicleTableBody tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return [cells[0].textContent, cells[1].textContent, cells[2].textContent];
    });

    const greenVehicles = Array.from(document.querySelectorAll('#greenVehicleTableBody tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return [cells[0].textContent, cells[1].textContent, cells[2].textContent];
    });

    localStorage.setItem('classicVehicles', JSON.stringify(classicVehicles));
    localStorage.setItem('greenVehicles', JSON.stringify(greenVehicles));

    calculateTransportImpact(); // Calcola l'impatto ogni volta che salviamo
}


// Punteggi veicoli (maggiore è il punteggio, maggiore è l'impatto ambientale)
const vehicleImpactScores = {
    classic: {
        Car: 8,
        Motorcycle: 6,
        Train: 6,
        Bus: 4,
        Metro: 4,
        Taxi: 6,
        Airplane: 14,
        Boat: 10
    },
    green: {
        Bike: 0.5,
        "Electric Car": 1,
        Funicular: 1,
        Tram: 1,
        "Electric scooter": 0.5
    }
};

// Funzione per calcolare l'impatto totale
function calculateTransportImpact() {
    const maxImpact = 25; // Percentuale massima del trasporto su home.html
    const maxLocalImpact = 100; // Percentuale massima per il grafico in transport.html

    // Calcolo dell'impatto per veicoli classici
    const classicVehicles = Array.from(document.querySelectorAll('#classicVehicleTableBody tr'));
    const classicImpact = classicVehicles.reduce((total, row) => {
        const cells = row.querySelectorAll('td');
        const vehicle = cells[0].textContent;
        const duration = parseFloat(cells[1].textContent) || 0; // Durata
        const timesUsed = parseFloat(cells[2].textContent) || 0; // Utilizzi
        const score = vehicleImpactScores.classic[vehicle] || 0;
        return total + (score * duration * timesUsed * 0.05); // Incremento lento
    }, 0);

    // Calcolo dell'impatto per veicoli green
    const greenVehicles = Array.from(document.querySelectorAll('#greenVehicleTableBody tr'));
    const greenImpact = greenVehicles.reduce((total, row) => {
        const cells = row.querySelectorAll('td');
        const vehicle = cells[0].textContent;
        const duration = parseFloat(cells[1].textContent) || 0; // Durata
        const timesUsed = parseFloat(cells[2].textContent) || 0; // Utilizzi
        const score = vehicleImpactScores.green[vehicle] || 0;
        return total + (score * duration * timesUsed * 0.7); // Riduzione lenta
    }, 0);

    // Calcolo impatto totale
    let totalImpact = classicImpact - greenImpact; // Veicoli green riducono il totale
    totalImpact = Math.max(0, totalImpact); // Evita valori negativi

    // Percentuale locale per il grafico in transport.html
    let localPercentage = (totalImpact / 10); // Dividi per un valore maggiore per crescita lenta
    localPercentage = Math.min(localPercentage, maxLocalImpact); // Limita al massimo locale (100%)

    // Percentuale globale da salvare in home.html
    const transportOverallImpact = Math.min((localPercentage / maxLocalImpact) * maxImpact, maxImpact);

    // Salva nel Local Storage
    localStorage.setItem('transportOverallImpact', transportOverallImpact.toFixed(1));
    localStorage.setItem('localTransportPercentage', localPercentage.toFixed(1)); // Salva la percentuale locale
    console.log('Salvo localTransportPercentage:', localPercentage);

    // Aggiorna il grafico locale in transport.html
    updateTransportChart(localPercentage);
}




function updateTransportChart(localPercentage = null) {
    // Recupera la percentuale da localStorage se non viene passata come parametro
    if (localPercentage === null) {
        localPercentage = parseFloat(localStorage.getItem('localTransportPercentage')) || 0;
        console.log('Recupero localTransportPercentage da localStorage:', localPercentage);

    }

    // Percentuale arrotondata, se è nulla mostra 0%
    const roundedPercentage = isNaN(localPercentage) || localPercentage === undefined ? 0 : Math.round(localPercentage);

    // Aggiorna la percentuale nel testo
    const percentageElement = document.querySelector('.percentage');
    if (percentageElement) {
        percentageElement.textContent = `${roundedPercentage}%`;
    }

    // Aggiorna il riempimento del cerchio
    const circle = document.querySelector('.circle');
    if (circle) {
        const fillDegree = roundedPercentage * 3.6; // Trasforma la percentuale in gradi (360° = 100%)
        circle.style.background = `conic-gradient(#4aa463 ${fillDegree}deg,rgb(255, 255, 255) ${fillDegree}deg)`;
    }
}




// Funzione per caricare i dati dal Local Storage
function loadFromLocalStorage() {
    if (!document.getElementById('classicVehicleTableBody') || !document.getElementById('greenVehicleTableBody')) {
        console.error("Element not found: Ensure the table IDs are correctly set in transport.html");
        return;
    }

    const classicVehicles = JSON.parse(localStorage.getItem('classicVehicles')) || [];
    const greenVehicles = JSON.parse(localStorage.getItem('greenVehicles')) || [];

    const classicTableBody = document.getElementById('classicVehicleTableBody');
    const greenTableBody = document.getElementById('greenVehicleTableBody');

    // Svuota le tabelle esistenti
    classicTableBody.innerHTML = '';
    greenTableBody.innerHTML = '';

    // Aggiungi solo righe valide per Classic Vehicles
    classicVehicles.forEach(vehicleData => {
        if (vehicleData.length === 3 && vehicleData[0] && vehicleData[1] && vehicleData[2]) {
            addVehicleRow('classic', vehicleData[0], vehicleData[1], vehicleData[2], false);
        }
    });

    // Aggiungi solo righe valide per Green Vehicles
    greenVehicles.forEach(vehicleData => {
        if (vehicleData.length === 3 && vehicleData[0] && vehicleData[1] && vehicleData[2]) {
            addVehicleRow('green', vehicleData[0], vehicleData[1], vehicleData[2], false);
        }
    });
}

// Carica i dati al caricamento della pagina
window.onload = function () {
    loadFromLocalStorage();
    updateTransportChart(); // Mostra la percentuale iniziale
};






// Grafico settimanale
const ctx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(ctx, {
    type: 'line', // Tipo di grafico
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Giorni della settimana
        datasets: [{
            label: '',
            data: [7, 5, 2, 2, 4, 5, 8], // Dati di esempio
            borderColor: '#4aa463', // Colore della linea
            backgroundColor: 'rgba(74, 164, 99, 0.2)', // Colore di riempimento
            borderWidth: 2, // Spessore della linea
            tension: 0.3 // Morbidezza della curva
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top'
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Energy (kWh)',
                    font: {
                      size: 10
                  }
                },
                beginAtZero: true
            }
        }
    }
});