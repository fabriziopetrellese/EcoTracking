/*resettare la percentuale temporaneamente:
  localStorage.setItem("foodImpactPercentage", 0);
da aggiungere tra:
  window.addFood = addFood;
  updateImpactDisplay();
*/

document.addEventListener("DOMContentLoaded", () => {
  const percentageElement = document.querySelector(".percentage");
  const chart = document.querySelector(".circular-chart");
  let currentImpactPercentage = parseInt(localStorage.getItem("foodImpactPercentage")) || 0;

  // Oggetto per gestire lo stato dei cibi
  let foodImpactState = JSON.parse(localStorage.getItem("foodImpactState")) || {};

  const updateImpactDisplay = () => {
    if (percentageElement && chart) {
      percentageElement.textContent = `${currentImpactPercentage}%`;
      const gradient = `conic-gradient(#4aa463 ${currentImpactPercentage}%, #fff ${currentImpactPercentage}% 100%)`;
  
      chart.style.background = gradient;
  
      // Salva la percentuale di food nel localStorage
      const foodImpact = parseFloat(((currentImpactPercentage / 100) * 25).toFixed(1)); // 100% equivale al 25% del totale
      localStorage.setItem("foodOverallImpact", foodImpact);
      // Lancia un evento personalizzato per notificare l'aggiornamento
      window.dispatchEvent(new CustomEvent("localStorageUpdated"));

      console.log("Food impact salvato:", foodImpact);
    }
  };
  

  const foodImpact = {
    "pasta": -4,
    "rice": -4,
    "bread": -4,
    "potato": -5,
    "steak": 8,
    "chicken": 7,
    "pork": 7,
    "lamb": 9,
    "egg": 5,
    "cheese": 7,
    "milk": 6,
    "butter": 8,
    "fish": 6,
    "shrimp": 8,
    "salmon": 7,
    "tuna": 7,
    "mussels": 4,
    "oysters": 4,
    "salad": -5,
    "tofu": -6,
    "beans": -5,
    "lentils": -6,
    "chickpeas": -6,
    "quinoa": -5,
    "avocado": -4,
    "cake": 5,
    "cookies": 5,
    "chocolate": 6,
    "ice cream": 6,
    "coffee": 6,
    "tea": 4,
    "juice": 4,
    "soda": 5,
    "water": -5,
    "apple": -5,
    "banana": -4,
    "orange": -4,
    "berries": -5,
    "grapes": -4,
    "carrot": -5,
    "broccoli": -5,
    "spinach": -6,
    "cucumber": -5,
    "tomato": -5,
    "onion": -5,
    "almonds": -4,
    "walnuts": -4,
    "sunflower seeds": -5,
    "peanuts": -4,
    "pizza": 6,
    "hamburger": 8,
    "hotdog": 7,
    "french fries": 5,
    "ketchup": 4,
    "mayonnaise": 5
};


  // Funzione per salvare lo stato nel localStorage
  const saveFoodState = (type, foodList) => {
    foodImpactState[type] = foodList;
    localStorage.setItem("foodImpactState", JSON.stringify(foodImpactState));
    localStorage.setItem("foodImpactPercentage", currentImpactPercentage);
    console.log("Stato salvato nel localStorage:", foodImpactState);
    console.log("Percentuale salvata nel localStorage:", currentImpactPercentage);

  };

  // Funzione per aggiungere un cibo
  const addFood = (type) => {
    const inputId = `${type}-dish-input`;
    const sectionId = `${type}-dish-section`;
    const inputElement = document.getElementById(inputId);
    const sectionElement = document.getElementById(sectionId);

    if (!inputElement || inputElement.value.trim() === "") {
      alert("Please enter a valid food item.");
      return;
    }

    const foodName = inputElement.value.trim().toUpperCase();
    const impact = foodImpact[foodName.toLowerCase()] || 0;

    currentImpactPercentage = Math.max(0, Math.min(100, currentImpactPercentage + impact));

    console.log("Cibo aggiunto:", foodName);
    console.log("Impatto calcolato per il cibo:", impact);
    console.log("Nuova percentuale calcolata:", currentImpactPercentage);


    const ulElement = sectionElement.querySelector("ul");
    const liElement = document.createElement("li");

    const removeButton = document.createElement("button");
    removeButton.textContent = "-";
    removeButton.className = "remove-button";
    removeButton.onclick = () => {
      currentImpactPercentage = Math.max(0, Math.min(100, currentImpactPercentage - impact));
      ulElement.removeChild(liElement);

      // Aggiorna lo stato
      foodImpactState[type] = foodImpactState[type].filter((food) => food.name !== foodName);
      saveFoodState(type, foodImpactState[type]);
      updateImpactDisplay();
    };

    const dishNameSpan = document.createElement("span");
    dishNameSpan.textContent = foodName;

    liElement.appendChild(removeButton);
    liElement.appendChild(dishNameSpan);
    ulElement.appendChild(liElement);

    // Aggiorna lo stato
    if (!foodImpactState[type]) foodImpactState[type] = [];
    foodImpactState[type].push({ name: foodName, impact });
    saveFoodState(type, foodImpactState[type]);

    updateImpactDisplay();
    inputElement.value = "";
  };

  // Funzione per recuperare lo stato salvato
  const loadFoodState = () => {
    Object.keys(foodImpactState).forEach((type) => {
      const sectionId = `${type}-dish-section`;
      const sectionElement = document.getElementById(sectionId);
      const ulElement = sectionElement.querySelector("ul");
      const foodList = foodImpactState[type];

      foodList.forEach((food) => {
        const liElement = document.createElement("li");
        const removeButton = document.createElement("button");
        removeButton.textContent = "-";
        removeButton.className = "remove-button";
        removeButton.onclick = () => {
          currentImpactPercentage = Math.max(0, Math.min(100, currentImpactPercentage - food.impact));
          ulElement.removeChild(liElement);

          // Aggiorna lo stato
          foodImpactState[type] = foodImpactState[type].filter((f) => f.name !== food.name);
          saveFoodState(type, foodImpactState[type]);
          updateImpactDisplay();
        };

        const dishNameSpan = document.createElement("span");
        dishNameSpan.textContent = food.name;

        liElement.appendChild(removeButton);
        liElement.appendChild(dishNameSpan);
        ulElement.appendChild(liElement);
      });
    });
  };

  console.log("Caricamento stato salvato...");
  console.log("Stato trovato nel localStorage:", foodImpactState);


  // Carica lo stato salvato all'avvio
  loadFoodState();

  window.addFood = addFood;
  updateImpactDisplay();
});

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