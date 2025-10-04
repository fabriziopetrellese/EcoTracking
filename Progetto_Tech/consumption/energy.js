// Variabili per tracciare giorno ed efficienza
let selectedDay = "Monday"; // Valore di default
let selectedEfficiency = "A"; // Valore di default
let totalPercentage = 0; // Percentuale totale accumulata

// Aggiorna il valore delle ore selezionate
function updateUsage(value) {
  document.getElementById('hours-output').textContent = value;
}

// Si chiude il menu dell'efficienza quando si clicca fuori
document.addEventListener('click', function (event) {
  const menu = document.getElementById('efficiency-menu');
  const button = document.getElementById('efficiency-button');
  
  // Controlla se il click è fuori dal pulsante e dal menu
  if (!menu.contains(event.target) && !button.contains(event.target)) {
    menu.style.display = 'none';
  }
});


// Mostra/nasconde il menu per selezionare la classe
function toggleClassMenu() {
  const menu = document.getElementById('efficiency-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('click', function (event) {
  const dayMenu = document.getElementById('day-menu');
  const dayButton = document.getElementById('day-button');
  
  // Controlla se il click è fuori dal pulsante e dal menu "Day"
  if (!dayMenu.contains(event.target) && !dayButton.contains(event.target)) {
    dayMenu.style.display = 'none';
  }
});

// Funzione per aprire/chiudere il menu dei giorni
function toggleDayMenu() {
  const dayMenu = document.getElementById('day-menu');
  dayMenu.style.display = dayMenu.style.display === 'none' ? 'block' : 'none';
}

// Funzione per selezionare un giorno
function selectDay(day) {
  const dayButton = document.getElementById('day-button');
  dayButton.textContent = day; // Aggiorna il pulsante con il giorno selezionato
  selectedDay = day;
  document.getElementById('day-menu').style.display = 'none'; // Nascondi il menu
}

// Seleziona una classe di efficienza
function selectEfficiency(classValue) {
  selectedEfficiency = classValue;
  document.getElementById('efficiency-button').textContent = classValue;
  document.getElementById('efficiency-menu').style.display = 'none';
}


const appliancesList = {
  "fridge": 0.5,
  "washing machine": 1.0,
  "oven": 1.3,
  "microwave": 1.0,
  "heater": 1.3,
  "air conditioner": 1.2,
  "dishwasher": 1.0,
  "television": 0.7,
  "computer": 0.8,
  "lamp": 0.3
};

// Funzione per calcolare l'incremento percentuale
function calculateEnergy(appliance, usageHours) {
  const baseEnergy = appliancesList[appliance] || 1.0; // Valore default se non trovato
  const dayCost = selectedDay === "Saturday" ? 0.9 : selectedDay === "Sunday" ? 0.7 : 1.2;
  const efficiencyMultiplier = { A: 0.3, B: 0.3, C: 0.4, D: 0.4, E: 0.6, F: 0.6 };
  const efficiencyValue = efficiencyMultiplier[selectedEfficiency] || 1.0;

  const energyUsed = baseEnergy * usageHours * dayCost * efficiencyValue;
  const percentageIncrease = Math.min((energyUsed / 20) * 100, 100 - totalPercentage);
  return percentageIncrease;
}

// Aggiorna il progresso sul grafico
function updateProgress(increment) {
  // Incrementa e limita la percentuale totale
  totalPercentage = Math.min(totalPercentage + increment, 100);

  console.log("Total Percentage:", parseFloat(Math.round(totalPercentage)));

  // Seleziona il grafico e il testo della percentuale
  const chart = document.querySelector('.circle');
  const percentageText = document.querySelector('.percentage');


  // Aggiorna il background dinamicamente usando conic-gradient
  chart.style.background = `conic-gradient(#4aa463 ${totalPercentage}%, #fff ${totalPercentage}% 100%)`;

  // Aggiorna il valore testuale della percentuale
  percentageText.textContent = `${Math.round(totalPercentage)}%`;

  const energyImpact = parseFloat(((totalPercentage / 100) * 25).toFixed(1));
  localStorage.setItem("energyOverallImpact", energyImpact);

  console.log("Energy Impact saved:", energyImpact);
}




// Aggiungi un nuovo elettrodomestico alla tabella
function addAppliance() {
  const applianceName = document.getElementById('appliance-name').value.trim().toLowerCase();
  const usageHours = parseInt(document.getElementById('usage-hours').value);

  if (applianceName && usageHours > 0) {
    const percentageIncrease = calculateEnergy(applianceName, usageHours);

    // Calcola consumo energetico
    const energyConsumption = (percentageIncrease / 100 * 20).toFixed(2);

    // Aggiunge la riga alla tabella Overview
    const table = document.getElementById('appliance-table');
    const newRow = table.insertRow();
    const rowIndex = table.rows.length; // Indice della riga
    newRow.innerHTML = `
    <td><button onclick="removeAppliance(${rowIndex})" class="remove-button">-</button></td>
      <td>${applianceName}</td>
      <td>${usageHours}</td>
      <td>${selectedDay}</td>
      <td>${selectedEfficiency}</td>
      <td>${energyConsumption} kWh</td>
    `;

    updateProgress(percentageIncrease); // Aggiorna grafico
    saveApplianceData(applianceName, usageHours, selectedDay, selectedEfficiency, energyConsumption);

    // Resetta i campi
    document.getElementById('appliance-name').value = '';
    document.getElementById('usage-hours').value = 3;
    document.getElementById('hours-output').textContent = 3;
  } else {
    alert('Please enter a valid appliance name and usage hours!');
  }
}


// Funzione per rimuovere un elettrodomestico
function removeAppliance(index) {
  const table = document.getElementById('appliance-table');
  const savedData = JSON.parse(localStorage.getItem('applianceData')) || [];

  // Rimuovi la riga dal localStorage
  if (index >= 0 && index < savedData.length) {
    const removedItem = savedData.splice(index, 1)[0];
    localStorage.setItem('applianceData', JSON.stringify(savedData));

    // Aggiorna il progresso rimuovendo il consumo energetico dell'elemento rimosso
    const energyRemoved = (parseFloat(removedItem.energy) / 20) * 100;
    totalPercentage = Math.max(totalPercentage - energyRemoved, 0);
    updateProgress(0); // Ricalcola il grafico con la nuova percentuale

    loadAppliances();
  }
}

// Funzione per ricaricare la tabella dopo una rimozione
function reloadTable() {
  const table = document.getElementById('appliance-table');
  table.innerHTML = ''; // Svuota la tabella
  totalPercentage = 0; // Reset della percentuale
  loadAppliances(); // Ricarica i dati salvati
}


// Caricare i dati dal localStorage all'avvio
function loadAppliances() {
  const savedData = JSON.parse(localStorage.getItem('applianceData')) || [];
  const table = document.getElementById('appliance-table');
  totalPercentage = 0; // Resetta la percentuale accumulata
  table.innerHTML = ''; // Svuota la tabella

  savedData.forEach((item, index) => {
    const newRow = table.insertRow();
    newRow.innerHTML = `
      <td><button class="remove-button">-</button></td>
      <td>${item.appliance}</td>
      <td>${item.usageHours}</td>
      <td>${item.day}</td>
      <td>${item.efficiency}</td>
      <td>${item.energy} kWh</td>
    `;

    // Associa l'evento onclick al pulsante, usando l'indice corrente
    newRow.querySelector('.remove-button').addEventListener('click', () => {
      removeAppliance(index);
    });

    updateProgress((item.energy / 20) * 100); // Aggiorna il grafico
  });
}

// Salvare i dati nel localStorage
function saveApplianceData(appliance, usageHours, day, efficiency, energy) {
  const savedData = JSON.parse(localStorage.getItem('applianceData')) || [];
  savedData.push({ appliance, usageHours, day, efficiency, energy });
  localStorage.setItem('applianceData', JSON.stringify(savedData));
}


// Caricare i dati quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', () => {
  loadAppliances();
});




// Grafico settimanale
const ctx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(ctx, {
    type: 'line', // Tipo di grafico
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Giorni della settimana
        datasets: [{
            label: '',
            data: [7, 3, 5, 5, 9, 1, 7], // Dati di esempio
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

