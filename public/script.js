const files = document.querySelectorAll('.file');
const viewer = document.getElementById('viewer');
const modal = document.getElementById('modal');
const passInput = document.getElementById('passInput');
const submitPass = document.getElementById('submitPass');
const error = document.getElementById('error');

files.forEach(file => {
  file.addEventListener('click', () => {
    const path = file.getAttribute('data-path');

    if (file.classList.contains('protected')) {
      modal.style.display = 'flex';
      passInput.value = '';
      error.style.display = 'none';
      window.currentPdfPath = path;
    } else {
      viewer.src = path;
    }
  });
});

submitPass.onclick = async () => {
  const res = await fetch('/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: passInput.value })
  });
  const data = await res.json();

  if (data.success) {
    viewer.src = window.currentPdfPath;
    modal.style.display = 'none';
  } else {
    error.style.display = 'block';
  }
};

// Close modal
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});