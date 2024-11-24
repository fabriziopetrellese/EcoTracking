// Variabili per tracciare giorno ed efficienza
let selectedDay = "Monday"; // Valore di default
let selectedEfficiency = "A"; // Valore di default

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


// Aggiungi un nuovo elettrodomestico alla tabella
function addAppliance() {
  const applianceName = document.getElementById('appliance-name').value;
  const usageHours = document.getElementById('usage-hours').value;

  if (applianceName && usageHours) {
    const energyConsumption = (usageHours * 0.26).toFixed(2); // Calcolo ipotetico dell'energia

    // Colonne della tabella Overview
    const table = document.getElementById('appliance-table');
    const newRow = table.insertRow();
    newRow.innerHTML = `
      <td>${applianceName}</td>
      <td>${usageHours}</td>
      <td>${selectedDay}</td>
      <td>${selectedEfficiency}</td>
      <td>${energyConsumption} kWh</td>
    `;

    // Resetta i campi
    document.getElementById('appliance-name').value = '';
    document.getElementById('usage-hours').value = 3;
    document.getElementById('hours-output').textContent = 3;
  } else {
    /* Errore nel caso non inserisca il nome */
    alert('Please enter appliance name and usage hours!');
  }
}




function updateProgress(percentage) {
  const chart = document.querySelector('.circular-chart');
  chart.style.setProperty('--percent', `${percentage}%`);
}
// Esempio di utilizzo:
//updateProgress(75);  Aggiorna con il 75%, o qualsiasi altra percentuale






// Grafico settimanale
const ctx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(ctx, {
    type: 'line', // Tipo di grafico
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Giorni della settimana
        datasets: [{
            label: '',
            data: [2, 12, 5, 15, 17, 11, 14], // Dati di esempio
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

