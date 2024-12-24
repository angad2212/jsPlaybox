const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

const mockWeather = {
    London: { temperature: "15°C", humidity: "70%" },
    Paris: { temperature: "18°C", humidity: "65%" },
    NewYork: { temperature: "20°C", humidity: "60%" },
}

app.get('/weather/:city', (req,res)=>{
    const city = req.params.city.charAt(0).toUpperCase() + req.params.city.slice(1).toLowerCase();
    const data = mockWeather[city];

    if(data){
        res.json({city, ...data}); //fill the array with teh data
    }else{
        res.status(404).json({message: "error"})
    }
})

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})