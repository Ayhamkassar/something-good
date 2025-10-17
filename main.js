const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const changeBgBtn = document.getElementById('changeBgBtn');
const langBtn = document.getElementById('langBtn');
const ratioSelect = document.getElementById("ratioSelect");
const colorButtons = document.querySelectorAll(".color-btn");
const brushSizeSelect = document.getElementById("brushSizeSelect");
const eraserBtn = document.getElementById("eraserBtn");
const colorSelect = document.getElementById("colorSelect");
let isErasing = false;

let isArabic = true;
let bgColor = window.matchMedia("(prefers-color-scheme: dark)").matches ? "#111" : "#f5f5f5";
let drawing = false;
let currentColor = "#ffffff";
let brushSize = 3;

function recolorShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => {
    shape.color = getRandomColor();
    drawShape(shape);
  });
}

function changeBackground() {
  bgColor = getRandomColor();
  canvas.style.background = bgColor;
}

function saveCanvas() {
  const link = document.createElement('a');
  link.download = 'my_art.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function toggleLanguage() {
  isArabic = !isArabic;
  if (isArabic) {
    generateBtn.textContent = "رسم لوحة جديدة";
    saveBtn.textContent = "حفظ اللوحة كصورة";
    changeBgBtn.textContent = "تغيير الخلفية";
    langBtn.textContent = "English";
    document.getElementById('mainTitle').textContent = "🎨 هديتك الفنية الخاصة 🎨";
    messages[0] = "هدية من مبرمج إلى رسامة رائعة 💛";
    messages[1] = "إبداعك يستحق كل الألوان 🌈";
    messages[2] = "استمتع بالرسم والفن ✨";
    messages[3] = "كل لوحة تولد قصة جديدة 🎨";
  } else {
    generateBtn.textContent = "Generate New Art";
    saveBtn.textContent = "Save Canvas";
    changeBgBtn.textContent = "Change Background";
    langBtn.textContent = "عربي";
    document.getElementById('mainTitle').textContent = "🎨 Your Special Art Gift 🎨";
    messages[0] = "A gift from a programmer to a wonderful artist 💛";
    messages[1] = "Your creativity deserves all the colors 🌈";
    messages[2] = "Enjoy painting and art ✨";
    messages[3] = "Each canvas creates a new story 🎨";
  }
}

generateBtn.addEventListener('click', generateArt);
saveBtn.addEventListener('click', saveCanvas);
changeBgBtn.addEventListener('click', changeBackground);
langBtn.addEventListener('click', toggleLanguage);
canvas.addEventListener('dblclick', recolorShapes);

function updateCanvasSize() {
  const [wRatio, hRatio] = ratioSelect.value.split(":").map(Number);
  const baseWidth = Math.min(window.innerWidth * 0.9, 1200);
  const newHeight = (baseWidth * hRatio) / wRatio;
  canvas.width = baseWidth;
  canvas.height = newHeight;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `${Math.max(18, baseWidth / 25)}px 'Cairo'`;
  ctx.fillText(`النسبة الحالية: ${wRatio}:${hRatio}`, 20, 50);
}
function changeBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, getRandomColor());
    gradient.addColorStop(1, getRandomColor());
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
ratioSelect.addEventListener("change", updateCanvasSize);
window.addEventListener("resize", updateCanvasSize);
updateCanvasSize();

let shapes = [];

function generateArt() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes = [];
  const shapesCount = 50;
  for (let i = 0; i < shapesCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 50 + 10;
    const shapeType = Math.floor(Math.random() * 3);
    const color = getRandomColor();
    const alpha = Math.random() * 0.7 + 0.3;
    const shape = { x, y, size, shapeType, color, alpha };
    shapes.push(shape);
    drawShape(shape);
  }

  generateBtn.style.backgroundColor = getRandomColor();
  const msg = messages[Math.floor(Math.random() * messages.length)];
  messageDiv.style.opacity = 0;
  messageDiv.textContent = msg;
  setTimeout(() => { messageDiv.style.opacity = 1; }, 1000);
}

function drawShape(shape) {
  ctx.globalAlpha = shape.alpha;
  ctx.fillStyle = shape.color;
  switch (shape.shapeType) {
    case 0:
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 1:
      ctx.fillRect(shape.x, shape.y, shape.size, shape.size);
      break;
    case 2:
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x + Math.random() * 100 - 50, shape.y + Math.random() * 100 - 50);
      ctx.lineWidth = Math.random() * 5 + 1;
      ctx.strokeStyle = shape.color;
      ctx.stroke();
      break;
  }
}

const messages = [
  "هدية من مبرمج إلى رسامة رائعة 💛",
  "إبداعك يستحق كل الألوان 🌈",
  "استمتع بالرسم والفن ✨",
  "كل لوحة تولد قصة جديدة 🎨"
];

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

function startDrawing(e) {
  e.preventDefault();
  drawing = true;
  draw(e);
}

function stopDrawing(e) {
  e.preventDefault();
  drawing = false;
  ctx.beginPath();
}
eraserBtn.addEventListener("click", () => {
  isErasing = !isErasing;
  if (isErasing) {
    eraserBtn.textContent = "🖌️ رجوع للرسم";
    eraserBtn.style.background = "linear-gradient(135deg, #ff4d4d, #ff8080)";
  } else {
    eraserBtn.textContent = "🧽 محاية";
    eraserBtn.style.background = "linear-gradient(135deg, #4d88ff, #4dff88)";
  }
});

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (isErasing) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over"; 
    ctx.strokeStyle = currentColor;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}


canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing, { passive: false });

document.body.addEventListener('touchstart', e => { if (e.target === canvas) e.preventDefault(); }, { passive: false });
document.body.addEventListener('touchmove', e => { if (e.target === canvas) e.preventDefault(); }, { passive: false });


colorSelect.addEventListener("input", () => {
  currentColor = colorSelect.value;
});


brushSizeSelect.addEventListener("change", () => {
  brushSize = parseInt(brushSizeSelect.value);
});
const aiCompleteBtn = document.getElementById('aiCompleteBtn');

async function aiComplete() {
  // إظهار مربع نص للمستخدم
  const userPrompt = prompt(isArabic 
    ? "اكتب وصف اللوحة التي تريد توليدها:" 
    : "Enter the description of the painting:");

  if(!userPrompt) return; // إذا ضغط إلغاء أو تركه فارغ، اخرج

  aiCompleteBtn.disabled = true;
  aiCompleteBtn.textContent = isArabic ? "AI يعمل..." : "AI Working...";

  try {
    const response = await fetch("http://localhost:3000/generate-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt })
    });

    const data = await response.json();
    if(data.data && data.data[0].url){
      const img = new Image();
      img.crossOrigin = "anonymous"; // مهم لتفادي مشاكل CORS عند التحميل
      img.src = data.data[0].url;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // تحميل الصورة مباشرة
        const link = document.createElement('a');
        link.download = 'ai_art.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }

  } catch (err) {
    console.error(err);
    alert(isArabic ? "حدث خطأ مع AI" : "AI Error occurred");
  } finally {
    aiCompleteBtn.disabled = false;
    aiCompleteBtn.textContent = isArabic ? "AI Complete 🎨" : "AI Complete";
  }
}



aiCompleteBtn.addEventListener("click", aiComplete);
