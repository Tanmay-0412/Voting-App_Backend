const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

const UserAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token){
            res.status(400).json({message:"Invalid Token"})
        }
        const decodedObj = await jwt.verify(token,'VotingApp@2026')
        const {_id} = decodedObj

        const user = await userModel.findById(_id)
        if(!user){
            res.status(400).json({message:"User not found!"})
        }
        req.user = user
        next()

    }catch(err){
        res.status(400).json({error:'Authentication Failed : ' + err.message})
    }
}

const checkAdminRole = 0

module.exports = UserAuth