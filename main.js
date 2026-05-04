const drawButton = document.getElementById('draw');
const numbersContainer = document.getElementById('numbers');

drawButton.addEventListener('click', () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  numbersContainer.innerHTML = '';
  Array.from(numbers).sort((a, b) => a - b).forEach(number => {
    const numberElement = document.createElement('div');
    numberElement.classList.add('number');
    numberElement.textContent = number;
    numbersContainer.appendChild(numberElement);
  });
});