const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Password from environment (for Render.com) – fallback for local testing
const CORRECT_PASSWORD = process.env.PASS || "12345";

app.use(express.static('public'));
app.use(express.json());

// Simple in-memory unlock (works perfectly for testing + Render free tier)
const unlocked = new Set();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// List of allowed PDFs
const allowedPdfs = ['mydocument'];

app.get('/pdfs/:name', (req, res) => {
  const name = req.params.name;
  if (!allowedPdfs.includes(name)) return res.status(404).send('Not found');
  res.sendFile(path.join(__dirname, 'public', 'pdf-viewer.html'));
});

app.post('/unlock', (req, res) => {
  const { password, pdf } = req.body;
  if (password === CORRECT_PASSWORD && allowedPdfs.includes(pdf)) {
    unlocked.add(pdf);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get('/view/:name.pdf', (req, res) => {
  const name = req.params.name;
  if (!unlocked.has(name)) {
    return res.status(403).send('Incorrect password or session expired');
  }

  const filePath = path.join(__dirname, 'pdfs', `${name}.pdf`);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + name + '.pdf"');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('sendFile error:', err);
      if (err && err.code === 'ENOENT') return res.status(404).send('File not found');
      return res.status(500).send('Server error');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Test password = 12345`);
});