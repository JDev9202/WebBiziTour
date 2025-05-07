
const intro = document.getElementById('intro');
const formContainer = document.getElementById('form-container');
const nextBtn = document.getElementById('next-btn');
const container = document.getElementById('participants-container');
const templateElem = document.getElementById('participant-template');
const addBtn = document.getElementById('add-participant-btn');
const submitBtn = document.querySelector('form button[type="submit"]');
const modal = document.getElementById('thankyou-modal');
const finishBtn = document.getElementById('finish-btn');
<<<<<<< HEAD
=======
const btnTour = document.getElementById('btnTour');
const btnRent = document.getElementById('btnRent');
const backBtn = document.getElementById('back-btn');


function createParticipantElement() {
  return templateElem.content.cloneNode(true);
}

container.addEventListener('click', e => {
  const btn = e.target;
  const part = btn.closest('.participant');
  if (!part) return;
  const idx  = Array.from(container.children).indexOf(part);
  const pad  = signaturePads[idx];

  if (btn.matches('.remove-participant-btn')) {
    signaturePads.splice(idx, 1);
    signatureAccepted.splice(idx, 1);
    part.remove();
    updateAdd(); updateSubmit();
  }
  else if (btn.matches('.confirm-signature-btn')) {
    if (!isSignatureValid(pad)) {
      alert('Please complete your signature.');
      return;
    }
    signatureAccepted[idx] = true;
    part.querySelector('.agreement-content').classList.add('disabled');
    pad.off();
    btn.disabled = true;
    part.querySelector('.clear-signature-btn').disabled = true;
    part.querySelectorAll('input, .remove-participant-btn').forEach(i => i.disabled = true);
    updateAdd();
  }
  else if (btn.matches('.clear-signature-btn')) {
    pad.clear();
    signatureAccepted[idx] = false;
    updateAdd();
  }
});


let formType = 'tour';  

function renderRentFields(part, index) {
  const rentBlock = part.querySelector('.rent-only');
  // Si es flujo "rent" y es el primer participante, lo mostramos
  const shouldShow = formType === 'rent' && index === 0;
  rentBlock.style.display = shouldShow ? 'block' : 'none';
}

>>>>>>> f58b973 (Testing)

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
<<<<<<< HEAD
  container.appendChild(part);
=======
  container.appendChild(clone);
  // tras appendChild:
  const parts     = container.children;
  const partIndex = parts.length - 1;    // 0 para el primer participante, 1 para el segundo, etc.


  // Mostrar/ocultar bloque Rent
  renderRentFields(part, partIndex);
>>>>>>> f58b973 (Testing)

  // Inyectar el agreement
  part.querySelector('.agreement-content').innerHTML = agreementHTML[formType];

  // Valores por defecto
  signatureAccepted.push(false);
  part.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];

  // Canvas y SignaturePad
  const canvasEl = part.querySelector('canvas.signature-pad');
  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvasEl.width  = canvasEl.offsetWidth  * ratio;
    canvasEl.height = canvasEl.offsetHeight * ratio;
    canvasEl.getContext('2d').scale(ratio, ratio);
  }
  setTimeout(resizeCanvas, 0);
<<<<<<< HEAD
  window.addEventListener('resize', resizeCanvas);

  // 2) Crear SignaturePad
=======
>>>>>>> f58b973 (Testing)
  const pad = new SignaturePad(canvasEl);
  signaturePads.push(pad);
  canvasEl.style.pointerEvents = 'none';
  canvasEl.style.opacity       = '0.5';

  // Controles
  const agreeChk   = part.querySelector('input[name="agree"]');
  const confirmBtn = part.querySelector('.confirm-signature-btn');
  const clearBtn   = part.querySelector('.clear-signature-btn');
  const bikeQtyInput    = part.querySelector('input[name="vintageBicycleQty"]');
  const ebikeQtyInput   = part.querySelector('input[name="vintageEBikeQty"]');
  const idPhotoInput    = part.querySelector('input[name="idPhoto"]');
  const uploadSpinner   = part.querySelector('.upload-spinner');
  const uploadCheckmark = part.querySelector('.upload-check');


  // Campos personales a vigilar
  const inputsAll  = part.querySelectorAll(
    'input[name="firstName"],' +
    'input[name="lastName"],' +
    'input[name="email"],' +
    'input[name="phone"],' +
    'input[name="date"]'
    
  );

  // Nuevo: captura el input de fecha de devolución (solo existe en Rent)
  const returnDateInput = part.querySelector('input[name="returnDateTime"]');

  // 1) Función de validación conjunta
  function checkInputs() {
    // 1️⃣ Campos personales válidos
    const okPersonal = Array.from(inputsAll).every(i => i.checkValidity());
  
    // 2️⃣ Fecha de devolución válida (solo primer Rent)
    let okRentDate = true;
    if (formType === 'rent' && partIndex === 0) {
      okRentDate = returnDateInput.value.trim() !== '';
    }
  
      // 3️⃣ Cantidades: al menos 1 bici o e‑bike (solo primer Rent)
  let okRentCount = true;
  if (formType === 'rent' && partIndex === 0) {
    const bike  = parseInt(bikeQtyInput.value,  10) || 0;
    const ebike = parseInt(ebikeQtyInput.value, 10) || 0;
    okRentCount = bike > 0 || ebike > 0;

    // Mensaje en ambos campos si falla
    if (!okRentCount) {
      const msg = 'Selecciona al menos 1 bici o e‑bike';
      bikeQtyInput.setCustomValidity(msg);
      ebikeQtyInput.setCustomValidity(msg);
    } else {
      bikeQtyInput.setCustomValidity('');
      ebikeQtyInput.setCustomValidity('');
    }
  }

  // 4️⃣ Foto de identificación (solo primer Rent)
let okPhoto = true;
if (formType === 'rent' && partIndex === 0) {
  okPhoto = idPhotoInput.files.length === 1;
  idPhotoInput.setCustomValidity(okPhoto
    ? ''
    : 'Debes subir tu foto de identificación.'
  );
}

  
    // 4️⃣ Habilita el checkbox si todo OK
    const enableAgreement = okPersonal && okRentDate && okRentCount && okPhoto;
    agreeChk.disabled = !enableAgreement;
    if (!enableAgreement) {
      agreeChk.checked = false;
      canvasEl.style.pointerEvents = 'none';
      canvasEl.style.opacity       = '0.5';
      confirmBtn.disabled = clearBtn.disabled = true;
      pad.clear();
    }
  
    updateAdd();
  }
  
  if (formType === 'rent' && partIndex === 0) {
    idPhotoInput.addEventListener('change', () => {
      uploadSpinner.style.display = 'inline-block';
      setTimeout(() => {
        uploadSpinner.style.display    = 'none';
        uploadCheckmark.style.display = 'inline-block';
        checkInputs(); // re‑valida también la foto
      }, 1000);
    });
  }
  

  // 2) Eventos para disparar la validación
  // Campos personales
inputsAll.forEach(i => i.addEventListener('input', checkInputs));

// Fecha de devolución (solo primer Rent)
if (formType === 'rent' && partIndex === 0 && returnDateInput) {
  returnDateInput.addEventListener('input', checkInputs);
}

// Cantidades (solo primer Rent)
if (formType === 'rent' && partIndex === 0) {
  bikeQtyInput.addEventListener('input', checkInputs);
  ebikeQtyInput.addEventListener('input', checkInputs);

  // Mostrar tooltip de error solo al perder foco
  bikeQtyInput.addEventListener('blur', () => bikeQtyInput.reportValidity());
  ebikeQtyInput.addEventListener('blur', () => ebikeQtyInput.reportValidity());
}

// Y no olvides la primera invocación
checkInputs();


  // 4) Listener del checkbox para liberar la firma
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
<<<<<<< HEAD
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

=======
>>>>>>> f58b973 (Testing)
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

// 2️⃣ Construir FormData
const formData = new FormData();
formData.append('formType', formType);
formData.append('participants', JSON.stringify(participants));

// 3️⃣ Adjuntar fichero (solo primer rent)
if (formType === 'rent') {
  const firstPart = container.children[0];
  const fileInput = firstPart.querySelector('input[name="idPhoto"]');
  if (fileInput.files[0]) {
    formData.append('idPhoto', fileInput.files[0]);
  }
}

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

backBtn.addEventListener('click', () => {
  formContainer.style.display = 'none';
  intro.style.display = 'block';
  container.innerHTML = '';
  signaturePads = [];
  signatureAccepted = [];
  count = 0;
  addBtn.disabled = true;
  submitBtn.disabled = true;
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
