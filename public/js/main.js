
function debounce(fn, ms = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

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

window.addEventListener('resize', debounce(() => {
  signaturePads.forEach((pad, idx) => {
    const data = pad.toDataURL();
    pad.clear();
    pad.fromDataURL(data);
  });
}, 200));

window.addEventListener('scroll', debounce(restoreSignatures, 200));

// Textos de acuerdo para cada tipo
const agreementHTML = {
  tour:`
          <h4>BICYCLE TOUR PARTICIPATION AGREEMENT</h4>
          <p>This agreement governs participation in a bike tour organized by <strong>BIZITOUR</strong>, a trademark of Digoo Design S.L. (CIF: B67988410), hereinafter referred to as "the Organizer," and the participant, hereinafter referred to as "the Client."</p>
          <h4>1. Purpose of the Agreement</h4>
          <p>The Client agrees to participate in a guided bike tour organized by the Organizer, which includes the use of a bicycle, helmet, and accessories (if applicable). The tour details, including route and duration, have been communicated in advance.</p>
          <h4>2. Client Responsibilities</h4>
          <ul>
            <li>Follow the guide’s instructions at all times.</li>
            <li>Use the safety equipment provided.</li>
            <li>Respect traffic laws and act prudently during the tour.</li>
            <li>Assume responsibility for any damages caused to third parties, the equipment, or themselves due to negligence or failure to comply with regulations.</li>
          </ul>
          <h4>3. Organizer Responsibilities</h4>
          <ul>
            <li>Ensure that bicycles and accessories are in optimal condition.</li>
            <li>Provide a qualified guide to lead the tour safely.</li>
            <li>Provide assistance in case of mechanical issues or problems during the tour.</li>
          </ul>
          <h4>4. Liability Waiver</h4>
          <ul>
            <li>The Organizer shall not be held responsible for injuries, accidents, or damages caused by the Client’s negligence.</li>
            <li>Loss of personal belongings during the tour.</li>
            <li>Tour cancellations or modifications due to adverse weather conditions or force majeure.</li>
          </ul>
          <h4>5. Cancellations and Refunds</h4>
          <ul>
            <li>Cancellations by the Client made at least 48 hours in advance are eligible for a full refund.</li>
            <li>Cancellations made less than 48 hours in advance will not be refunded.</li>
            <li>The Organizer reserves the right to modify or cancel the tour for safety reasons, offering rescheduling or a refund.</li>
          </ul>
          <h4>6. Data Protection</h4>
          <p>The Client agrees to the use of their personal data solely for the management of the tour, in compliance with GDPR regulations.</p>
          <h4>7. Jurisdiction</h4>
          <p>This agreement is governed by the laws of Spain, with both parties submitting to the courts of the Organizer's registered location.</p>
          <p><em>"By signing this agreement, the undersigned represents and accepts responsibility for the entire group of participants, who agree to abide by the terms herein."</em></p>
          <h4>8. Group Participation Clause</h4>
          <p>In the case of group tours, the Group Leader signs this agreement on behalf of all participants, certifying that they have been informed of and agree to the stated terms. The Group Leader assumes responsibility for any violations by the group members. A participant list must be provided to the organizer, and if required, each member may sign their individual acceptance separately.</p>
         `,
  rent: `
  <h4>BICYCLE RENTAL AGREEMENT</h4>
  <h4>1. Late Return</h4>
  <p>If you return the equipment after the agreed time, a late fee of <em>[amount]</em> per hour/day will apply.</p>

  <h4>2. Your Responsibilities</h4>
  <ul>
    <li><strong>Care:</strong> Please take good care of the equipment and return it in the same condition as when you received it. You may be responsible for repair costs if any damage occurs.</li>
    <li><strong>Loss or Theft:</strong> In case of loss or theft, the following replacement fees apply:
      <ul>
        <li>Lock: €15</li>
        <li>Helmet: €20</li>
        <li>Lights, Brakes, or Pedals: €10 each</li>
        <li>Bike Seat: €20</li>
        <li>Wheel: €30</li>
        <li>Baby/Toddler Seat: €50</li>
        <li>Basket: €12</li>
        <li>Bicycles:
          <ul>
            <li>Vintage City Bike: €450</li>
            <li>Vintage E‑Bike: €1,650</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>

  <h4>3. Safety and Compliance</h4>
  <p>The Client agrees to comply with all traffic laws and regulations and is responsible for any damages (to themselves or third parties) resulting from accidents during bicycle use.</p>

  <h4>4. Liability</h4>
  <p><strong>BiziTour Malaga</strong> isn’t liable for any claims arising from your use of the equipment. By renting from us, you agree to indemnify and hold us harmless from such claims.</p>

  <h4>5. Security Measures</h4>
  <ul>
    <li>Always lock the bicycle securely when not in use.</li>
    <li>To prevent theft, avoid leaving it outside overnight.</li>
    <li>Lock through the frame and wheels in well-lit areas.</li>
  </ul>

  <h4>6. Assistance with Breakdowns and Flat Tires</h4>
  <p><strong>Breakdowns:</strong> If you experience a mechanical issue:
    <ul>
      <li>Visit our shop at Plaza Montaño, 4 for a free replacement.</li>
      <li>If returning isn’t feasible:
        <ul>
          <li>Option 1: Call a taxi to bring you and the bike back; we’ll cover the fare.</li>
          <li>Option 2: Have the bike repaired at a nearby shop; we’ll reimburse the cost.</li>
        </ul>
      </li>
    </ul>
  </p>
  <p><strong>Flat Tires:</strong>
    <ul>
      <li>Have it repaired at a nearby shop; we’ll cover the full cost.</li>
      <li>During operating hours (09:00–18:00), call a taxi to bring you and the bike back; we’ll cover half the fare.</li>
    </ul>
  </p>

  <h4>7. Shop Hours and Late Returns</h4>
  <p>Our shop closes at 18:00. If you return the bike after closing, it will be considered a 12‑hour extension, and additional fees will apply.</p>

  <h4>8. Governing Law</h4>
  <p>This agreement is governed by the laws of Spain.</p>

  <p><em>By signing below, you acknowledge that you’ve read, understood, and agree to these terms.</em></p>
`
};

const intro = document.getElementById('intro');
const formContainer = document.getElementById('form-container');
const container = document.getElementById('participants-container');
const templateElem = document.getElementById('participant-template');
const addBtn = document.getElementById('add-participant-btn');
const submitBtn = document.querySelector('form button[type="submit"]');
const modal = document.getElementById('thankyou-modal');
const finishBtn = document.getElementById('finish-btn');
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


let count = 0, signaturePads = [], signatureAccepted = [];

// Justo debajo de las constantes intro y formContainer
function showForm() {
  intro.style.display = 'none';
  formContainer.style.display = 'block';
}

btnTour.addEventListener('click', () => {
  formType = 'tour';
  showForm();
  addPart();
});

btnRent.addEventListener('click', () => {
  formType = 'rent';
  showForm();
  addPart();
});


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


function updateAdd() {
  const count = container.children.length;
  const last  = container.children[count - 1];
  if (!last) return;
  const fields = last.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"],input[type="date"],input[type="datetime-local"],input[type="number"]');
  const allValid = Array.from(fields).every(i => i.checkValidity());
  const checked = last.querySelector('input[name="agree"]').checked;
  const signed = signatureAccepted[signatureAccepted.length - 1];
  addBtn.disabled = !(allValid && checked && signed);
  updateSubmit();
}

function updateSubmit() {
  const parts = Array.from(container.children);
  const ok = parts.length > 0 && Array.from(parts).every((p, i) => {
    const fields = p.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"],input[type="date"],input[type="datetime-local"],input[type="number"]');
    return Array.from(fields).every(f => f.checkValidity())
      && p.querySelector('input[name="agree"]').checked
      && signatureAccepted[i];
  });
  submitBtn.disabled = !ok;
}

function addPart() {
  count++;
  const clone = createParticipantElement();
  const part = clone.querySelector('.participant');
  part.querySelector('.index').innerText = count;
  if (count === 1) part.querySelector('.remove-participant-btn').style.display = 'none';
  container.appendChild(clone);
  // tras appendChild:
  const parts     = container.children;
  const partIndex = parts.length - 1;    // 0 para el primer participante, 1 para el segundo, etc.


  // Mostrar/ocultar bloque Rent
  renderRentFields(part, partIndex);

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
  updateAdd();
}


addBtn.addEventListener('click', addPart);
//addPart(); Esto lo quite para que no cree participante hasta que no se presione Tour o Rent

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
signature: signaturePads[i].toDataURL(),
// ▲▼ Rent‑only fields (will be undefined for Tour)
returnDateTime: part.querySelector('input[name="returnDateTime"]')?.value || null,
vintageBicycleQty: parseInt(part.querySelector('input[name="vintageBicycleQty"]')?.value, 10) || 0,
vintageEBikeQty: parseInt(part.querySelector('input[name="vintageEBikeQty"]')?.value, 10) || 0,
lockQty: parseInt(part.querySelector('input[name="lockQty"]')?.value, 10) || 0,
helmetQty: parseInt(part.querySelector('input[name="helmetQty"]')?.value, 10) || 0,
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
     method: 'POST',
     body: formData     // let the browser set multipart/form-data
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
  modal.style.display = 'none';
  window.location.reload();
});





