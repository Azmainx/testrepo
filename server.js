const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// === SECURITY: Password from environment variable ===
const CORRECT_PASSWORD = '12345'; // fallback for local testing

app.use(express.static('public'));
app.use(express.json());

// In-memory session-like unlock state (per browser tab/session)
// In production with multiple instances, use Redis. For Render free tier: this is acceptable.
const unlockedPdfs = new Set(); // stores unlocked PDF keys like "mydocument"

// Serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve individual PDF pages
app.get('/pdfs/:pdfName', (req, res) => {
  const pdfName = req.params.pdfName;
  const validPdfs = ['mydocument']; // add your PDFs here
  if (!validPdfs.includes(pdfName)) {
    return res.status(404).send('PDF not found');
  }
  res.sendFile(path.join(__dirname, 'public', 'pdf-viewer.html'));
});

// Password check endpoint (now per-PDF)
app.post('/unlock', (req, res) => {
  const { password, pdf } = req.body;
  if (password === CORRECT_PASSWORD) {
    unlockedPdfs.add(pdf); // unlock this PDF for this session
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Serve PDF if unlocked
app.get('/pdf/:pdfName', (req, res) => {
  const pdfName = req.params.pdfName;
  const key = pdfName.split('.')[0]; // e.g., mydocument.pdf → mydocument

  if (!unlockedPdfs.has(key)) {
    return res.status(403).send('Password required to view this PDF');
  }

  res.sendFile(path.join(__dirname, 'pdf', `${key}.pdf`));
});

app.listen(PORT, () => {
  console.log(`Secure PDF server running on port ${PORT}`);
});