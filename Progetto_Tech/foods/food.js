function addFood(category) {
  var inputId = category + "-dish-input";  // Assicurati che questo ID corrisponda all'ID nel tuo HTML
  var foodInput = document.getElementById(inputId);
  var foodValue = foodInput.value.trim();

  if (foodValue === '') {
    alert('Please enter a food item for ' + category + ' dishes.');
    return;
  }
  foodValue = foodValue.toUpperCase();
  var sectionId = category + '-dish-section';  // Verifica che questo ID corrisponda alla sezione della lista
  var foodList = document.getElementById(sectionId).getElementsByTagName('ul')[0];
  var listItem = document.createElement('li');
  

  var removeButton = document.createElement('button');
  removeButton.textContent = '-';
  removeButton.className = 'remove-button';
  removeButton.onclick = function () {
    listItem.remove();
  };

var dishName = document.createElement('span');
dishName.textContent = foodValue.toUpperCase(); // Converti il testo in maiuscolo
dishName.className = 'dish-name'; // Assicurati che questa classe sia applicata
listItem.appendChild(dishName);

  listItem.appendChild(removeButton);
  listItem.appendChild(dishName);
  foodList.appendChild(listItem);

  foodInput.value = ''; // Clear the input field
}







  