const express = require('express')
const UserAuth = require('../middleware/auth')
const candidateModel = require('../models/candidate')
const userModel = require('../models/user')
const voteRouter = express.Router()

voteRouter.post('/cast/vote/:candidateId', UserAuth, async(req,res)=>{
    try{    
        const candidateId = req.params.candidateId
        const userId = req.user._id
        const candidate = await candidateModel.findById(candidateId)
        if(!candidate){
            res.status(404).json({message:'Candidate not found'})
        }
        const user = await userModel.findById(userId)
        if(!user){
            res.status(404).json({message:"User not found"})
        }
        
        if(user.isVoted){
            res.status(400).json({message:'You have already voted'})
        }
        if(user.role === 'admin'){
            res.status(403).json({message:'Admin is not allowed to vote'})
        }

        // update the candidate document record to vote
        candidate.votes.push({user : userId})
        candidate.voteCount ++
        await candidate.save()

        // update the user document
        user.isVoted = true
        await user.save()

        res.json({message:'vote recorded successfully'})

    }catch(err){
        res.status(400).json({message:err.message})
    }
})

voteRouter.get('/vote/count', UserAuth,  async(req,res)=>{
    try{
        const candidate = await candidateModel.find().sort({voteCount:'desc'})

        const voteRecord = candidate.map((data)=> { 
            return{ party:data.party,
                    count: data.voteCount
        }})

        res.json({message:"Vote counts fetched successfully", data:voteRecord})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports = voteRouter