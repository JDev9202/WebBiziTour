const intro = document.getElementById('intro');
const formContainer = document.getElementById('form-container');
const nextBtn = document.getElementById('next-btn');
const container = document.getElementById('participants-container');
const templateElem = document.getElementById('participant-template');
const addBtn = document.getElementById('add-participant-btn');
const submitBtn = document.querySelector('form button[type="submit"]');
const modal = document.getElementById('thankyou-modal');
const finishBtn = document.getElementById('finish-btn');

let count = 0, signaturePads = [], signatureAccepted = [];

function isSignatureValid(signaturePad) {
if (signaturePad.isEmpty()) {
return false; // El lienzo está completamente vacío
}

const dataUrl = signaturePad.toDataURL();
const minDataUrlLength = 5000; // Ajustable: mínimo de datos para considerar válida la firma

if (dataUrl.length < minDataUrlLength) {
return false; // La firma es demasiado pequeña (ej: solo un puntito)
}

return true; // La firma parece razonable
}


// Mostrar formulario inicial
nextBtn.addEventListener('click', () => {
  intro.style.display = 'none';
  formContainer.style.display = 'block';
});

function updateAdd() {
  const parts = container.querySelectorAll('.participant');
  const last = parts[parts.length - 1];
  if (!last) return;
  const fields = last.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"],input[type="date"]');
  const allValid = Array.from(fields).every(i => i.checkValidity());
  const checked = last.querySelector('input[name="agree"]').checked;
  const signed = signatureAccepted[signatureAccepted.length - 1];
  addBtn.disabled = !(allValid && checked && signed);
  updateSubmit();
}

function updateSubmit() {
  const parts = container.querySelectorAll('.participant');
  const ok = parts.length > 0 && Array.from(parts).every((p, i) => {
    const fields = p.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"],input[type="date"]');
    return Array.from(fields).every(f => f.checkValidity())
      && p.querySelector('input[name="agree"]').checked
      && signatureAccepted[i];
  });
  submitBtn.disabled = !ok;
}

function addPart() {
  count++;
  const clone = templateElem.content.cloneNode(true);
  const part = clone.querySelector('.participant');
  part.querySelector('.index').innerText = count;
  if (count === 1) part.querySelector('.remove-participant-btn').style.display = 'none';
  container.appendChild(part);

  signatureAccepted.push(false);
  const idx = signatureAccepted.length - 1;
  part.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];

  const canvasEl = part.querySelector('canvas.signature-pad');

  // 1) Calibrar el canvas según DPR
  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvasEl.width  = canvasEl.offsetWidth  * ratio;
    canvasEl.height = canvasEl.offsetHeight * ratio;
    canvasEl.getContext('2d').scale(ratio, ratio);
  }
  setTimeout(resizeCanvas, 0);
  window.addEventListener('resize', resizeCanvas);

  // 2) Crear SignaturePad
  const pad = new SignaturePad(canvasEl);
  signaturePads.push(pad);

  // 3) Bloquear canvas hasta que se marque checkbox
  canvasEl.style.pointerEvents = 'none';
  canvasEl.style.opacity       = '0.5';

  const agreeChk   = part.querySelector('input[name="agree"]');
  const confirmBtn = part.querySelector('.confirm-signature-btn');
  const clearBtn   = part.querySelector('.clear-signature-btn');
  const inputsAll  = part.querySelectorAll(
    'input[name="firstName"],input[name="lastName"],input[name="email"],input[name="phone"],input[name="date"]'
  );

  function checkInputs() {
    const ok = Array.from(inputsAll).every(i => i.checkValidity());
    agreeChk.disabled = !ok;
    if (!ok) agreeChk.checked = false;
    confirmBtn.disabled = true;
    clearBtn.disabled   = true;
    updateAdd();
  }
  inputsAll.forEach(i => i.addEventListener('input', checkInputs));
  checkInputs();

  agreeChk.addEventListener('change', () => {
    if (agreeChk.checked) {
      resizeCanvas();  
      canvasEl.style.pointerEvents = 'auto';
      canvasEl.style.opacity       = '1';
      confirmBtn.disabled = false;
      clearBtn.disabled   = false;
    } else {
      canvasEl.style.pointerEvents = 'none';
      canvasEl.style.opacity       = '0.5';
      confirmBtn.disabled = true;
      clearBtn.disabled   = true;
      pad.clear();
    }
    updateAdd();
  });

  pad.onEnd = updateAdd;
  clearBtn.addEventListener('click', () => {
    pad.clear();
    signatureAccepted[idx] = false;
    updateAdd();
  });
  confirmBtn.addEventListener('click', () => {
if (!isSignatureValid(pad)) {
alert('Please provide a complete and valid signature before confirming.');
return; // 🚫 Detener si la firma es inválida
}

// 🔵 Si pasa la validación, continúa todo normal
signaturePads[idx] = pad.toDataURL();
signatureAccepted[idx] = true;
part.querySelector('#agreement-content').classList.add('disabled');
pad.off();
confirmBtn.disabled = true;
clearBtn.disabled = true;
part.querySelectorAll('input, .remove-participant-btn').forEach(el => el.disabled = true);
updateAdd();
});


  part.querySelector('.remove-participant-btn').addEventListener('click', () => {
    signaturePads.splice(idx, 1);
    signatureAccepted.splice(idx, 1);
    container.removeChild(part);
    updateAdd();
    updateSubmit();
  });

  updateAdd();
}

addBtn.addEventListener('click', addPart);
addPart();

document.getElementById('form').addEventListener('submit', async e => {
e.preventDefault();

// Desactivar el botón y agregar spinner
submitBtn.disabled = true;
submitBtn.innerHTML = 'Procesando... <div class="spinner"></div>';

const participants = Array.from(container.children).map((part, i) => ({
firstName: part.querySelector('input[name="firstName"]').value,
lastName : part.querySelector('input[name="lastName"]').value,
email    : part.querySelector('input[name="email"]').value,
phone    : part.querySelector('input[name="phone"]').value,
date     : part.querySelector('input[name="date"]').value,
agree    : part.querySelector('input[name="agree"]').checked,
signature: signaturePads[i]
}));

try {
const res = await fetch('/submit', {
  method : 'POST',
  headers: { 'Content-Type': 'application/json' },
  body   : JSON.stringify({ participants })
});
const data = await res.json();
if (data.ok) {
  modal.style.display = 'flex';
} else {
  alert('Error sending: ' + data.error);
  submitBtn.disabled = false;
  submitBtn.innerText = "Submit All";
}
} catch {
alert('Network error.');
submitBtn.disabled = false;
submitBtn.innerText = "Submit All";
}
});



finishBtn.addEventListener('click', () => {
finishBtn.addEventListener('click', () => {
// Ocultamos el modal (opcional)
modal.style.display = 'none';
// ▶️ Recargamos la página para limpiar todo el estado
window.location.reload();
});

});

// ➡️ Restaurar las firmas guardadas al hacer scroll
function restoreSignatures() {
  const parts = container.querySelectorAll('.participant');
  parts.forEach((part, idx) => {
    const canvas = part.querySelector('canvas.signature-pad');
    const saved = signaturePads[idx];
    if (saved && canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = saved;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  });
}

// ➡️ Cada vez que haces scroll, restauramos firmas
window.addEventListener('scroll', restoreSignatures);

