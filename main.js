const drawButton = document.getElementById('draw');
const numbersContainer = document.getElementById('numbers');
const bonusContainer = document.getElementById('bonus');
const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.add('light');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

function getBallColor(n) {
  if (n <= 10) return 'yellow';
  if (n <= 20) return 'blue';
  if (n <= 30) return 'red';
  if (n <= 40) return 'gray';
  return 'green';
}

function createBall(number, delay, isBonus = false) {
  const ball = document.createElement('div');
  ball.classList.add('number', getBallColor(number));
  if (isBonus) ball.classList.add('bonus');
  ball.textContent = number;
  ball.style.animationDelay = `${delay}ms`;
  return ball;
}

drawButton.addEventListener('click', () => {
  drawButton.disabled = true;
  numbersContainer.innerHTML = '';
  bonusContainer.innerHTML = '';

  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picked = pool.slice(0, 7);
  const main = picked.slice(0, 6).sort((a, b) => a - b);
  const bonus = picked[6];

  main.forEach((n, i) => {
    numbersContainer.appendChild(createBall(n, i * 150));
  });

  setTimeout(() => {
    const plus = document.createElement('span');
    plus.className = 'plus';
    plus.textContent = '+';
    bonusContainer.appendChild(plus);
    bonusContainer.appendChild(createBall(bonus, 0, true));
  }, main.length * 150 + 200);

  setTimeout(() => {
    drawButton.disabled = false;
  }, main.length * 150 + 800);
});
