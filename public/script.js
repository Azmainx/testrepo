const modal = document.getElementById('modal');
const unlockBtn = document.getElementById('unlockBtn');
const submitPass = document.getElementById('submitPass');
const cancel = document.getElementById('cancel');
const passInput = document.getElementById('passInput');
const error = document.getElementById('error');
const pdfViewer = document.getElementById('pdfViewer');
const pdfFrame = document.getElementById('pdfFrame');

// Open modal
unlockBtn.onclick = () => {
  modal.style.display = 'flex';
};

// Cancel
cancel.onclick = () => {
  modal.style.display = 'none';
  passInput.value = '';
  error.style.display = 'none';
};

// Submit password
submitPass.onclick = async () => {
  const res = await fetch('/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      password: passInput.value,
      pdf: window.currentPdf  // important: which PDF we're unlocking
    })
  });
  const data = await res.json();

  if (data.success) {
    modal.style.display = 'none';
    unlockBtn.style.display = 'none';
    document.getElementById('status').textContent = 'PDF Unlocked!';
    pdfViewer.style.display = 'block';
    pdfFrame.src = `/pdf/${window.currentPdf}.pdf?t=${Date.now()}`; // cache bust
  } else {
    error.style.display = 'block';
  }
};

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});