const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/files', express.static('files'));
app.use(express.json());

// Your fixed password
const PASSWORD = '12345';
let isUnlocked = false;

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Unlock endpoint
app.post('/unlock', (req, res) => {
  if (req.body.password === PASSWORD) {
    isUnlocked = true;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Protected PDF route
app.get('/open-secret-pdf', (req, res) => {
  if (!isUnlocked) {
    return res.status(403).send('Password required to view this document');
  }
  res.sendFile(path.join(__dirname, 'files', 'secret-document.pdf'));
});

app.listen(PORT, () => {
  console.log(`VS Code PDF Viewer running on https://your-app.onrender.com`);
});