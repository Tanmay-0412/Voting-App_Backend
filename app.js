require('dotenv').config(); 
const express = require('express')
const app = express()
const PORT = process.env.PORT || 2000
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cookieParser())

const userRouter  = require('./router/userRouter')
const profileRouter = require('./router/profileRouter')
const candidateRouter = require('./router/candidateRouter')
const adminRouter = require('./router/adminRouter')
const voteRouter = require('./router/voteRouter')

app.use('/', userRouter)
app.use('/', profileRouter)
app.use('/', candidateRouter)
app.use('/', adminRouter)
app.use('/', voteRouter)

mongoose.connect(process.env.DB_URI)
    .then(()=> console.log('Database connected successfully...'))
    .catch((err)=> console.error(err) )

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}...`)
})