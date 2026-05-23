const mongoose = require('mongoose')

// Define the candidate schema
const candidateSchema = new mongoose.Schema({
    candidateName:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            votedAt:{
                type:Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0
    },
    imageUrl:{
        type:String,
        default:'https://img.magnific.com/premium-vector/voting-campaign-line-icon-person-vote-election-campaign-sign-participation-democracy-political-candidate-voter-ballot-support-civic-engagement-advocacy-right-vote-public-decision_727385-14731.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL:" + value)
            }
        }
    }
})

const candidateModel = mongoose.model('Candidate', candidateSchema)
module.exports = candidateModel