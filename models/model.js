const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
    _id:schema.Types.ObjectId,
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
        type:String
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
<<<<<<< HEAD
module.exports = {User,Post}
=======
module.exports = { User, Post }
>>>>>>> 064c9598077f17637a01d27ada67e3f8d05ceaf9
