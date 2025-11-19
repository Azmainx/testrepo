const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/files', express.static('files'));
app.use(express.json());

const PASSWORD = '12345';        // ← change this anytime
let unlocked = false;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/unlock', (req, res) => {
  if (req.body.password === PASSWORD) {
    unlocked = true;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get('/secret-pdf', (req, res) => {
  if (!unlocked) return res.status(403).send('Access denied');
  res.sendFile(path.join(__dirname, 'files', 'mydocument.pdf'));
});

app.listen(PORT, () => console.log('VS Code PDF vault ready'));