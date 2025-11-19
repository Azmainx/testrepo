document.querySelectorAll('.file').forEach(el => {
  el.addEventListener('click', () => {
    const url = el.dataset.url;
    if (el.classList.contains('locked')) {
      document.getElementById('modal').style.display = 'flex';
      window.pendingUrl = url;
    } else {
      document.getElementById('pdf-viewer').src = url;
    }
  });
});

document.getElementById('unlockBtn').onclick = async () => {
  const pass = document.getElementById('pass').value;
  const res = await fetch('/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: pass })
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('pdf-viewer').src = window.pendingUrl;
  } else {
    document.getElementById('error').style.display = 'block';
  }
};

// Close modal on background click
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
});