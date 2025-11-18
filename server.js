const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the PDF when someone visits the root URL
app.get('/', (req, res) => {
  const pdfPath = path.join(__dirname, 'pdf', 'mydocument.pdf');

  // Optional: force download instead of opening in browser
  // res.download(pdfPath, 'mydocument.pdf');

  // This will open the PDF directly in the browser (recommended)
  res.sendFile(pdfPath, (err) => {
    if (err) {
      res.status(404).send('PDF not found');
    }
  });
});

// Optional: nice route like /download or /pdf
app.get('/pdf', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`PDF server running on port ${PORT}`);
  console.log(`Go to https://your-app.onrender.com to see your PDF`);
});