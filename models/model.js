const mongoose = require("mongoose");
const schema = mongoose.Schema;



const UserSchema = new schema({
  
    email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    unique:true
},
provider:{
    type:String,
    default:'기본 이용자'
}
},{timestamps:true}
)


const CommentSchema = new schema({
    type:{
        type:Boolean,
        required:true,
    },
    like:{
        type:Number,
        required:true,
    },
    content:{
        type:String,
        default:'no comment'
    },
    userId:{type:schema.Types.ObjectId, ref:'User', required:true}

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
    image:{
        type:String,
        default:''
    },
    isOpen:{
        type:Boolean,
        default:true
    },
    comment:{
        type:[CommentSchema],
        default:[]
    },
//또는 child: comment
    userId:{type:schema.Types.ObjectId, ref:'User', required:true}

    },
    {timestamps:true}
    )



// const PostSchema = new mongoose.Schema({
//     title,content,image,userId,date, comment{_id,type,like,content(op),userId}
//     title:String,
//     age:Number,
//     saveDate:{
//         type:Date,
//         default:Date.now
//     }
// })
const User = mongoose.model("User",UserSchema)
const Post = mongoose.model("Post", PostSchema)
module.exports = {User,Post}