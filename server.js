// npm install cors express nodemon

const PORT = 8000;
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(express.json())
app.use(cors())
// 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

// mygpt 새로 키 발급
// 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
const API_KEY = process.env.API_KEY

app.post('/completaions',async(req,res)=>{
    const options = {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${API_KEY}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            model : 'gpt-3.5-turbo',
            messages:[{role:"user",content:req.body.message}],
            max_tokens:100,
        })
    }
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions',options)
        const data = await response.json()
        res.send(data)
    }catch(error){
        console.error(error)
    }
})




app.listen(PORT,()=>console.log("서버 온" + PORT))