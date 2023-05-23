const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  
    email:{
    type:String,
    required:true,
    // unique:true
},
password:{
    type:String
},
provider:{
    type:String,
    default:'local'
},
bookmarks:[{ type: schema.Types.ObjectId, ref: 'Post' }],
point:{
    type:Number,
    default:0
},
},{timestamps:true}
)

const CommentSchema = new schema({
   
    like:[{ type: schema.Types.ObjectId, ref: 'User' }]
    ,
    content:{
        type:String,
        default:'no comment'
    },
    type:{
        type:String,
        default:''
    },
    userId:{type:schema.Types.ObjectId, ref:'User', required:true},

    isJudgement:{
        type:Boolean,
        default:false
    },
    isBest:{
        type:Boolean,
        default:false
    },

},{timestamps:true})

const PostSchema = new schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    keyword:{
         type: [String]
    }
    ,   
    image:{
        type:String,
        default:''
    },
    isOpen:{
        type:Boolean,
        default:true
    },
    userId:{type:schema.Types.ObjectId, ref:'User', required:true},

    sara:{
    type:Number,
    default:0
    },
    mara:{
    type:Number,
    default:0
    },

    ratio:{
    type:Number,
    required:true,
    setDefaultsOnInsert:true,
    default:0
    },
  
        
    comment:{
        type:[CommentSchema],
        default:[]
    },

    },
    {timestamps:true}
    )
const SalkamalkakingSchema = new schema({
  
    _id: { type: String },
userId:{
    type:String
},
point:{
    type:Number,
}
},{timestamps:true}
)


const User = mongoose.model("User",UserSchema)
const Post = mongoose.model("Post", PostSchema)
const Salkamalkaking = mongoose.model("Salkamalkaking", SalkamalkakingSchema)

module.exports = { User, Post, Salkamalkaking }
