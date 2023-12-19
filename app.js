require('dotenv').config()
const express=require("express")
require("./database/database").connect()
const User=require("./model/user")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser')


const app=express()
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("<h1>Port is running <\h1>")
})
app.post("/register",async(req,res)=>{
    try {
        // get all the data from the body
        
        const { firstname,lastname,email,password}=req.body
        
        // all the data in req.body  should exist
        if(!(firstname && lastname && email && password)){
            res.status(400).send("all fields are compulsory")
        }
        // check if the user already exist
        const existinguser=await User.findOne({email})
        if(existinguser){
            res.status(401).send("User with email id already exists")
        }
        ///encrypt the password 
        const myEncpassword= await bcrypt.hash(password,10)

        ///save the user in DB with excrypted password

        const user= await User.create({
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:myEncpassword

        })

        /// generate a token and send it
        var token = jwt.sign({ id: user._id }, 'shhhhh',
        {
            expiresIn:"2h"
        });
        user.token=token
        user.password=undefined  //it will not to be sent to db

        res.status(201).json(user)
         
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post("/login",async(req,res)=>{
    try {

    //get all the data from the frotend 
    const {email,password}=req.body

    //validate all datas are sent to log in
    if(!(email && password)){
        res.status(400).send("send all data")
    }
    //find user in DB
    const user=await User.findOne({email})
    
    //match the password and generate token
    if(user && (await bcrypt.compare(password ,user.password))){
        const token = jwt.sign({ id: user._id }, 'shhhhh',
        {
            expiresIn:"2h"
        });
        user.token=token
        user.password=undefined

        /////cookie section
        const options={
            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true
        };
        res.status(200).cookie("token",token,options).json({
            success:true,
            token,
            user
        })

    }
        
    } catch (error) {
        console.log(error)
        
    }

    

})

module.exports = app