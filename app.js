require('dotenv').config()
const express=require("express")
require("./database/database").connect()


const app=express()

app.get("/",(req,res)=>{
    res.send("<h1>Port is running <\h1>")
})

module.exports = app