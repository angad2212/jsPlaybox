const express = require('express');
const app = express();
const PORT = 3004;
app.use(express.json());

let notes = [];

//to post a note in the database
app.post('/notes', (req,res)=>{
    const note = req.body;
    if(!note){
        res.status(400).json({
            message: 'no note in the request'
        });
    }
    //if note available, push it in the local database:
    notes.push(note);
    res.status(201).json({
        message: 'note successfully stored', 
        notes
    });
})

//to get all the notes in the database
app.get('/notes', (req,res)=>{
    if(!notes){
        res.status(400).json({
            message: 'no notes stored yet'
        })
    }
    res.status(201).json({
        notes
    });
})


//to delete a specific note
app.delete('/notes/:index', (req,res)=>{
    const note = parseInt(req.params.index, 10);
    //This is the radix that specifies the number system to be used for the conversion.
    //this is for decimal numbers

    //check is the index is in bounds 
    const size = notes.length;
    if(note>-1){
        res.status(400).json({
            message: 'out of bounds'
        })
    } 

    notes.splice(note, 1);
    res.status(201).json({
        message: 'note deleted successfully',
        notes
    })
})

app.listen(PORT, ()=>{
    console.log(`the server is runnign on the port: ${PORT}`);
})