const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;

app.use(cors({
  //origin: 'https://media-kart.vercel.app',
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

// Create "uploads" and "data" folders if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}
const winnersPath = path.join(__dirname, 'data', 'winner.json');

// Multer file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// In-memory winner tracking
let winners = [];
let previousWinners = [];

// Admin login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    if (fs.existsSync(winnersPath)) {
      try {
        fs.unlinkSync(winnersPath);
      } catch (error) {
        // do nothing
      }
    }
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// File upload and CSV parsing route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const rows = fileData.split('\n').map(row => row.split(','));

  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = row[index]?.trim();
      return obj;
    }, {});
  });

  res.json({ data });
});

app.post('/api/select-winner', (req, res) => {
  const { candidates } = req.body;
  if(fs.existsSync(winnersPath)) {
    try {
      const fileData = fs.readFileSync(winnersPath, 'utf-8');
      previousWinners = JSON.parse(fileData);
    } catch (error) {
      previousWinners = []
    }

  }
  // const available = candidates.filter(
  //   candidate => !previousWinners.includes(candidate.name)
  // );

  // if (available.length === 0) {
  //   return res.status(400).json({ message: 'No candidates left' });
  // }

  // const winner = available[Math.floor(Math.random() * available.length)];
  // winners.push(winner);
  // previousWinners.push(winner.name);

  res.json(previousWinners);
});

app.post('/api/save-winner', (req, res) => {
  const newWinner = req.body;
  let savedWinners = [];
  if (fs.existsSync(winnersPath)) {
    const fileData = fs.readFileSync(winnersPath, 'utf-8');
    if (fileData.trim() !== '') {
      try {
        savedWinners = JSON.parse(fileData);
      } catch (error) {
        return res.status(500).json({ success: false, message: "Invalid JSON format in winner.json" });
      }
    }
  }
  const alreadySelected = savedWinners.some(
    (w) => w.email === newWinner.email
  );

  if (alreadySelected) {
    return res.status(400).json({ success: false, message: "Already selected" });
  }

  savedWinners.push(newWinner);

  fs.writeFileSync(winnersPath, JSON.stringify(savedWinners, null, 2));
  res.status(200).json({ success: true, winner: newWinner });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
