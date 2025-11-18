const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public and /pdf
app.use(express.static('public'));
app.use('/pdf', express.static('pdf'));
app.use('/password.json', express.static('public')); // allows access to password.json

// Root route → serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Password-protected PDF running on port ${PORT}`);
});