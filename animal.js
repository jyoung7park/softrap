const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/Nq-EiR5hx/';
let model = null;

tmImage.load(MODEL_URL + 'model.json', MODEL_URL + 'metadata.json')
  .then(m => { model = m; })
  .catch(e => console.error('모델 로드 실패:', e));

const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const previewImg = document.getElementById('preview-img');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.onload = () => showSection('preview');
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function analyze() {
  if (!model) {
    alert('모델을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    return;
  }
  showSection('loading');
  try {
    const predictions = await model.predict(previewImg);
    showResult(predictions);
  } catch (e) {
    alert('분석에 실패했습니다. 다른 사진으로 시도해주세요.');
    showSection('preview');
  }
}

const RESULTS = {
  dog: {
    high: {
      title: '순수 개상!',
      desc: '밝고 친근한 인상으로 주변을 편안하게 만드는 타입이에요. 사교적이고 활발해서 처음 만난 사람과도 금방 친해지는 매력을 가졌어요!',
      tags: ['#활발함', '#친근함', '#사교적', '#충성스러움'],
    },
    low: {
      title: '개상 기질!',
      desc: '전체적으로 개상에 가깝지만 고양이의 매력도 살짝 품은 타입이에요. 친근하면서도 때로는 도도한 반전매력이 있어요!',
      tags: ['#친근함', '#사교적', '#반전매력'],
    },
  },
  cat: {
    high: {
      title: '순수 고양이상!',
      desc: '도도하고 신비로운 인상으로 상대방의 호기심을 자극하는 타입이에요. 독립적이고 우아하며, 마음을 연 사람에게는 한없이 다정해요!',
      tags: ['#도도함', '#우아함', '#신비로움', '#독립적'],
    },
    low: {
      title: '고양이상 기질!',
      desc: '전체적으로 고양이상에 가깝지만 개의 친근함도 살짝 품은 타입이에요. 신비롭지만 가까워지면 의외로 다정한 매력이 있어요!',
      tags: ['#신비로움', '#도도함', '#반전다정'],
    },
  },
};

function showResult(predictions) {
  const dog = predictions.find(p => p.className === 'dog');
  const cat = predictions.find(p => p.className === 'cat');
  const dogPct = Math.round(dog.probability * 100);
  const catPct = 100 - dogPct;

  const isDog = dogPct >= catPct;
  const pct = isDog ? dogPct : catPct;
  const type = isDog ? 'dog' : 'cat';
  const level = pct >= 70 ? 'high' : 'low';
  const data = RESULTS[type][level];

  document.getElementById('result-emoji').textContent = isDog ? '🐶' : '🐱';
  document.getElementById('result-title').textContent = data.title;
  document.getElementById('result-desc').textContent = data.desc;
  document.getElementById('result-tags').innerHTML =
    data.tags.map(t => `<span class="tag">${t}</span>`).join('');

  const dogBar = document.getElementById('dog-bar');
  const catBar = document.getElementById('cat-bar');
  dogBar.style.width = '0%';
  catBar.style.width = '0%';
  document.getElementById('dog-pct').textContent = dogPct + '%';
  document.getElementById('cat-pct').textContent = catPct + '%';

  document.getElementById('result-card').className =
    'result-card ' + (isDog ? 'dog-card' : 'cat-card');

  showSection('result');

  requestAnimationFrame(() => requestAnimationFrame(() => {
    dogBar.style.width = dogPct + '%';
    catBar.style.width = catPct + '%';
  }));
}

function showSection(name) {
  ['upload', 'preview', 'loading', 'result'].forEach(s => {
    document.getElementById(s + '-section').style.display = s === name ? '' : 'none';
  });
}

document.getElementById('analyze-btn').addEventListener('click', analyze);
document.getElementById('reset-btn').addEventListener('click', () => {
  fileInput.value = '';
  showSection('upload');
});
document.getElementById('retry-btn').addEventListener('click', () => {
  fileInput.value = '';
  showSection('upload');
});
