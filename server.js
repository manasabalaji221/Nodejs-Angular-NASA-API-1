const express = require('express')
const path = require('path')
const app = express()

//assigning a post route to the variable
const posts = require('./server/routes/posts')

app.use(express.static(path.join(__dirname, 'dist/angular-nasa/')))

//passing posts route to the middleware
app.use('/posts', posts)

//to get all requests
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, "dist/angular-nasa/index.html"))
})

const port = process.env.PORT || 4600

app.listen(port, (req,res)=>{
    console.log('RUNNING')
});