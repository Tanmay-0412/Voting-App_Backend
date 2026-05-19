const express = require('express')
const UserAuth = require('../middleware/auth')
const candidateModel = require('../models/candidate')
const userModel = require('../models/user')
const candidateRouter = express.Router()
const checkAdminRole = require('../utilis/validation')

const Allowed_Fields =  ["candidateName","party","age","votes","voteCount"]

candidateRouter.post('/candidate/add', UserAuth, async(req,res)=>{
    try{
        const isAdmin = await checkAdminRole(req.user._id)
        if(!Allowed_Fields){
            return res.status(400).json({message:'Invalid Edit Request'})
        }
        if(!isAdmin){
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

candidateRouter.patch('/candidate/update/:candidateId', UserAuth, async(req,res)=>{
    try{
        const data = req.body
        const isAdmin = await checkAdminRole(req.user._id)
        if(!Allowed_Fields){
            return res.status(400).json({message:'Invalid Edit Request'})
        }
        if(!isAdmin){
            return res.status(400).json({message:'User is not a Admin'})
        }
        const candidateId = req.params.candidateId

        const candidate = await candidateModel.findByIdAndUpdate(candidateId, data, 
            {new: true, runValidators: true}
        )
        if(!candidate){
            res.status(404).json({message:'Candidate not Found'})
        }
        res.json({message:'Candidate updated successfully', data : candidate })

    }catch(err){
        res.status(400).json({message:err.message})
    }
})

candidateRouter.delete('/candidate/delete/:candidateId', UserAuth, async(req,res)=>{
    try{
        const candidateId = req.params.candidateId
        const isAdmin = await checkAdminRole(req.user._id)
            if(!Allowed_Fields){
                return res.status(400).json({message:'Invalid Edit Request'})
            }
            if(!isAdmin){
                return res.status(403).json({message:'User is not a Admin'})
            }
        
        const candidate = await candidateModel.findByIdAndDelete(candidateId)
        if(!candidate){
                res.status(404).json({message:'Candidate not Found'})
            }
        res.json({message:'Candidate deleted successfully'})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports = candidateRouter