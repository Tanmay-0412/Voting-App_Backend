const express = require('express')
const UserAuth = require('../middleware/auth')
const userModel = require('../models/user')
const adminRouter = express.Router()
const { checkAdminRole } = require('../utilis/validation')
const candidateModel = require('../models/candidate')

adminRouter.get('/users/list', UserAuth, async(req,res)=>{
        try{
            const isAdmin = await checkAdminRole(req.user._id);
            if(!isAdmin){
                res.status(404).json({message:"User is not a Admin"})
            }
            const users = await userModel.find()
            res.json({message:'Users fetched successfully', data : users})

        }catch(err){
            res.status(500).json({message:err.message})
        }
})

adminRouter.get('/candidates/list', UserAuth, async(req,res)=>{
    try{
        const candidates = await candidateModel.find().populate("votes.user", "username")
        res.json({message:'Candidates fetched successfully', data : candidates})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

adminRouter.get('/dashboard', UserAuth, async(req,res)=>{
    try{
        const users = await userModel.find()
        const candidates = await candidateModel.find()

        const candidateVotes = candidates.map(c=>({
            candidateId : c._id,
            name: c.candidateName,
            votesCount:c.votes.length
        }))
        const totalVotes = candidateVotes.reduce((sum,c)=> sum + c.votesCount, 0)
        
        const leadingCandidate = candidateVotes.reduce((max,c)=>
            c.votesCount > max.votesCount ? c : max, candidateVotes[0]
        )
        res.json({
            message:'Data fetched successfully',
            totalUsers : users.length,
            totalCandiates: candidateVotes.length,
            totalVotes,
            candidateVotes,
            leadingCandidate,
        })
    }catch(err){
        return res.send(500).json({message:err.message})
    }
})

module.exports = adminRouter