const modal = document.getElementById('modal');
const unlockBtn = document.getElementById('unlockBtn');
const submitPass = document.getElementById('submitPass');
const cancel = document.getElementById('cancel');
const passInput = document.getElementById('passInput');
const error = document.getElementById('error');
const pdfViewer = document.getElementById('pdfViewer');
const pdfEmbed = document.getElementById('pdfEmbed');
const status = document.getElementById('status');

// Open modal
unlockBtn.onclick = () => {
  modal.style.display = 'flex';
  passInput.value = ''; // Clear input
  error.style.display = 'none';
};

// Cancel
cancel.onclick = () => {
  modal.style.display = 'none';
};

// Submit password
submitPass.onclick = async () => {
  const password = passInput.value;
  if (!password) {
    error.textContent = 'Please enter a password!';
    error.style.display = 'block';
    return;
  }

  try {
    const res = await fetch('/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: password,
        pdf: window.currentPdf  // important: which PDF we're unlocking
      })
    });
    const data = await res.json();

    if (data.success) {
      modal.style.display = 'none';
      unlockBtn.style.display = 'none';
      status.textContent = 'PDF Unlocked! Rendering...';
      pdfViewer.style.display = 'block';
      
      // Set the embed src (works for <embed>, <object>, <iframe>)
      pdfEmbed.src = window.pdfUrl;
      pdfEmbed.data = window.pdfUrl; // For <object>
      document.getElementById('pdfFrame').src = window.pdfUrl; // For <iframe> fallback
      
      // Update status after a delay (give time for render)
      setTimeout(() => {
        status.textContent = 'PDF Loaded Successfully!';
      }, 1000);
    } else {
      error.style.display = 'block';
      status.textContent = 'Invalid password. Try again.';
    }
  } catch (err) {
    console.error('Unlock error:', err);
    error.textContent = 'Connection error. Try again.';
    error.style.display = 'block';
  }
};

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Enter key to submit
passInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitPass.click();
  }
});