
const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    profile:{
        type:String,
    },
    firstname:{
        type:String
       
    },
    lastname:{
        type:String
        
    },
    email:{
        type:String
       
    },
    phone:{
        type:String
        
    },
    gender:{
        type:String
        
    }
    
})


const user= mongoose.model('User',userSchema)


module.exports =user