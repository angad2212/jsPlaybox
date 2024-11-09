const express = require('express');
const app = express();
const PORT = 3005;

app.use(express.json());  // Ensure this is added


//local database
let nextId = 1;
let posts = [];

app.post('/posts', (req,res)=>{
    const { title, body } = req.body;

    if(!title || !body){
        res.status(400).json({
            message: 'invalid inputs'
        });
    }

    //create new post
    const newPost = {
        id: nextId++,
        title,
        body,
        timestamp: new Date(),
    }

    posts.push(newPost);
    res.status(201).json({
        message: 'post created successfully'
    })
})

app.get('/posts', (req, res) => {
    res.json(posts); 
});


app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;  // Get the ID from the request URL
    const postIndex = posts.findIndex(post => post.id === parseInt(id));

    if (postIndex === -1) {
        return res.status(404).json({
            message: 'Post not found'
        });
    }

    posts.splice(postIndex, 1);  // Remove the post from the array
    res.status(200).json({
        message: `Post with ID ${id} deleted successfully`
    });
});

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})