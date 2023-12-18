

const app = require("./app")


const {PORT} =process.env


app.listen(PORT,()=>{
    console.log(`the port is running at  ${PORT}`)
})
