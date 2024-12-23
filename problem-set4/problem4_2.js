const express = require('express');
const app = express();
const PORT = 3006;

app.use(express.json());

app.post('/calculate', (req,res)=>{
    const { num1, num2, operation } = req.body;

if (!num1 || !num2 || !operation) {
    return res.status(400).json({
        message: "Please input all the required fields."
    });
}

    let result;
    switch(operation){
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1*num2;
            break;
        case 'divide':
            if(num2 === 0){
                res.json({
                    message: "invalid input, not divisible by 0"
                })
            }
            result = num1/num2;
            break;
        default:
            res.json({
                message: "invalid operation"
            })    
    }
    res.json({
        result
    })
})

app.listen(PORT,()=>{
    console.log(`listening at port: ${PORT}`);
})