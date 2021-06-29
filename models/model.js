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
    unique:true
},
provider:{
    type:String,
    default:'local'
},
bookmark:{
    type:Array,
    default:[]
},
point:{
    type:Number,
    default:0
},
},{timestamps:true}
)

const CommentSchema = new schema({
   
    like:{
        type:Number,
        default:0
    },
    content:{
        type:String,
        //required:true,
        default:'no comment'
    },
    type:{
        type:String,
        //required:true,
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
    image:{
        type:String,
        default:''
    },
    isOpen:{
        type:Boolean,
        default:true
    },
    userId:{type:schema.Types.ObjectId, ref:'User', required:true},
    
    //type(사라/마라)와 comment(댓글)을 분리해서 간주
    //요청의 바디에 type과 comment가 각각 있을 수도 있고 없을 수도 있고
    //몽고디비의 특성을 잘 이해하지 못한거 아니냐는 질문에 대한 대답
    //->쿼리를 계산해서 해오는 것을 떠나서 매 쿼리를 할때마다 효율이 떨어진다.
    //->필요에 따라 모델링을 유연하게 수정 할 수 있는 것도 몽고디비의 장점이라고 생각
    
    //사라마라-> 한 포스트 안에 사라/마라의 개수들을 카운팅을 해야하는데, type으로 퉁치면 셀 수가 없음, 불리언값을 누적할 수가 없기 때문(true면 true false면 false)
    
    // type:{
    //     type:Boolean,
    //     required:true,
    // },
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
    
        
//comment컨트롤러에서 추가!!
    comment:{
        type:[CommentSchema],
        default:[]
    },

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

module.exports = { User, Post }
