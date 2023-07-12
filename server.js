const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const filePath = file.path;
  const fileExt = file.originalname.split('.').pop().toLowerCase();

  if (fileExt === 'csv') {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        res.json(results);
      });
  } else if (fileExt === 'json') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading the file.');
      }

      const jsonData = JSON.parse(data);
      res.json(jsonData);
    });
  } else {
    res.status(400).send('Invalid file type. Please upload a CSV or JSON file.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(5500, () => {
  console.log('Server is running on port 5500'); 
});
