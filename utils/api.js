// api.js - Backend server Node.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { register, login } = require('./auth');
const { getFiles, uploadFile } = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder untuk file upload (sementara lokal)
const uploadFolder = path.join(__dirname, '../public/files');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes

// Register user
app.post('/api/register', (req, res) => {
    const { username, email, password, plan } = req.body;
    const result = register(username, email, password, plan || 'free');
    if(result.error) return res.status(400).json(result);
    res.json(result);
});

// Login user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const result = login(email, password);
    if(result.error) return res.status(400).json(result);
    res.json(result);
});

// Get all files
app.get('/api/files', (req, res) => {
    const files = getFiles();
    res.json(files);
});

// Upload new file
app.post('/api/upload', upload.single('file'), (req, res) => {
    const { owner } = req.body;
    if(!req.file) return res.status(400).json({error: 'File tidak ada'});
    
    const url = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    const newFile = uploadFile(req.file.originalname, req.file.mimetype, (req.file.size/(1024*1024)).toFixed(2)+'MB', owner, url);
    res.json(newFile);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
