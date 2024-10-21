const express = require('express');
const bodyParser = require('body-parser'); // Not used in this code, can be removed
const multer = require('multer');
const path = require('path'); // Missing import for 'path'

const app = express();
const PORT = 3002;

// Storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
        //This line names the file with the current timestamp followed by its original name 
        //(e.g., 1631231231234-image.jpg), which helps avoid filename conflicts.
    },
});

// Multer middleware 
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        // Allowed file types
        const filetypes = /jpg|jpeg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes);
        }
    },
}).single('file'); // 'file' should match the name attribute in the form

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
