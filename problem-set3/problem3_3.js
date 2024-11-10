const express = require('express');
const multer = require('multer');
const path = require('path');
const port = 3006;

const app = express();
app.use(express.json());

//setting up storage with file name:
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/'); //here images will be stored
    },  
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname)); //unique file name
    }
})

//setting up file limits
const uploads = multer({
    storage: storage,
    limits: {fileSize: 1 * 1024 * 1024}, //1MB
    fileFilter: (req, file, cb)=>{
        const filetypes = /jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname){
            return cb(null, true);
        }else {
            cb(new Error('Only .jpg and .png files are allowed!'));
        }
    },
})

app.post('/upload-image', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        // Handle errors
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size should not exceed 1MB.' });
          }
          return res.status(400).json({ error: err.message });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }
      }
  
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or file type not allowed.' });
      }
  
      // Successful upload
      res.json({ message: 'File uploaded successfully!', filename: req.file.filename });
    });
  });

  
app.listen(port, ()=>{
    console.log(`server running on port: ${port}`)
})