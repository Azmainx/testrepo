const unlockBtn = document.getElementById('unlockBtn');
const modal = document.getElementById('modal');
const submitPass = document.getElementById('submitPass');
const cancel = document.getElementById('cancel');
const passInput = document.getElementById('passInput');
const error = document.getElementById('error');

unlockBtn.onclick = () => {
  modal.style.display = 'flex';
  passInput.value = '';
  error.style.display = 'none';
};

cancel.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

submitPass.onclick = async () => {
  const res = await fetch('/password.json');
  const data = await res.json();
  
  if (passInput.value === data.password) {
    // Correct password → open PDF in new tab
    window.open('/pdf/mydocument.pdf', '_blank');
    modal.style.display = 'none';
  } else {
    error.style.display = 'block';
  }
};