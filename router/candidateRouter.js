const express = require('express')
const UserAuth = require('../middleware/auth')
const candidateModel = require('../models/candidate')
const userModel = require('../models/user')
const candidateRouter = express.Router()

const checkAdminRole = async(userId) =>{
    try{
        const user = await userModel.findById(userId)
        return user.role === 'admin'
    }catch(err){
        return false
    }
}

candidateRouter.post('/candidates', UserAuth, async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(400).json({message:'User is not a Admin'})
        }
          const data = req.body 
          const newCandidate = new candidateModel(data)
          await newCandidate.save()
          res.json({message:'Candidate added successfully'})
    }catch(err){
        res.status(400).json({error:err.message})
    }
})

candidateRouter.put('/candidate/update', UserAuth, async(req,res)=>{
    try{

    }catch(err){
        
    }
})

module.exports = candidateRouter