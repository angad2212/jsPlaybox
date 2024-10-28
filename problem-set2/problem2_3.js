const express = require('express');
const PORT = 3005;
const app = express();
const zod = require('zod');
app.use(express.json());

//set zod schema for the user validation:
const registrationSchema = zod.object({
    name: zod.string().min(1, {message: 'name is required'}),
    email: zod.string().email({message: 'email is required'}),
    password: zod.string().min(6, {message: 'atleast 6 letters required'})
})

app.post('/register', (req,res)=>{
    const validation = registrationSchema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({
            message: 'error with the inputs'
        })
    }
    res.status(201).json({
        message: 'success'
    })
})

app.listen(PORT, ()=>{
    console.log(`server is running in port: ${PORT}`);
})