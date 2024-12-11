document.getElementById('transportForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene il comportamento di default di invio del modulo

    // Recupero dei dati dai campi del form
    var classicVehicle = document.getElementById('classicVehicle').value;
    var duration = document.getElementById('duration').value;
    var timesUsed = document.getElementById('timesUsed').value;
    var greenVehicle = document.getElementById('greenVehicle').value;
    var durationGreen = document.getElementById('durationGreen').value;
    var timesUsedGreen = document.getElementById('timesUsedGreen').value;


    // Controllo per i veicoli classici
    if (classicVehicle !== "" && (duration <= 0 || timesUsed <= 0)) {
        alert("Please complete all fields for Classic Vehicle.");
    } else if (classicVehicle !== "" && duration > 0 && timesUsed > 0) {
        document.getElementById('classic-vehicle-name').textContent = classicVehicle;
        document.getElementById('classic-duration').textContent = `${duration} min`;
        document.getElementById('classic-times-used').textContent = timesUsed;
        document.getElementById('transportForm').reset();
    }

    // Controllo per i veicoli green
    if (greenVehicle !== "" && (durationGreen <= 0 || timesUsedGreen <= 0)) {
        alert("Please complete all fields for Green Vehicle.");
    } else if (greenVehicle !== "" && durationGreen > 0 && timesUsedGreen > 0) {
        document.getElementById('green-vehicle-name').textContent = greenVehicle;
        document.getElementById('green-duration').textContent = `${durationGreen} min`;
        document.getElementById('green-times-used').textContent = timesUsedGreen;
        document.getElementById('transportForm').reset();
    }

    // Verifica che almeno un campo sia stato compilato prima del reset
    if (classicVehicle === "" && greenVehicle === "") {
        alert("Please select a vehicle and fill out the fields.");
    }
});


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