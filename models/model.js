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
    type:String
}
},{timestamps:true}
)

const CommentSchema = new schema({
    type:{
        type:Boolean,
    },
    like:{
        type:Number
    },
    content:{
        type:String
    },
    userId:{

    },
    userId:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}]

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
        type:String
    },
    children:[CommentSchema],
//또는 child: comment
    userId:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}]

    },{timestamps:true}
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
module.exports = User, Post