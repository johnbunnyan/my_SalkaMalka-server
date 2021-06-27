/* option 
require("dotenv").config();
*/
const {User} = require('../models/model')
const {Post} = require('../models/model')

module.exports = {

    //사라마라 컨트롤러
    newCommentController:async(req,res)=>{

//사라나 마라는 무조건 있어야한다.
if(req.body.sara ||req.body.mara){

  //1. 코멘트 콘텐트가 있으면 배열에 넣는다
    if(req.body.content){
         Post.findById(req.body.postId)
        .then((doc)=>{
            //console.log(doc)
        doc.comment.push(
            {
         content:req.body.content,
        userId:req.body.userId
        }
        )
        doc.save()
        })
    .then((out)=>{
            console.log("new comment saved")
        })

}

 //2. 사라마라 요청마다 1씩 더한다
if(req.body.sara && req.body.mara===undefined){
    //sara카운트 올리기(update)
    Post.findByIdAndUpdate(req.body.postId,{$inc:{sara:1}},{
        new:true,
        //runValidators:true
    })
    .then(()=>{
        res.json("사라를 등록했어요!").status(201)
    })
.catch(error=>{console.log(error) 
res.status(500).send("err")})

}
else if(req.body.mara&& req.body.sara===undefined){
    //mara카운트 올리기(update)
    Post.findByIdAndUpdate(req.body.postId,{$inc:{mara:1}},{
        new:true,
        //runValidators:true
    })
    .then(()=>{
        res.json("마라를 등록했어요!").status(201)
    })
.catch(error=>{console.log(error) 
res.status(500).send("err")})
}

}

else{
    res.status(400).json("사라 혹은 마라 둘 중 하나를 투표해주세요!")
}


    },



    likeCommentController:async(req,res)=>{

        console.log(req.params.commentId)

        // {$push:{like:1}},{
        //     new:true,
        //     //runValidators:true
        // })


//


Post.updateOne({
    "_id": req.body.postId, //this is level O select
    "comment": {
        "$elemMatch": {
            "_id": req.params.commentId, //this is level one select
         
        }
    }
},
    {
        // "$set": {
        //     "comment.$[outer].like": +1,
        // },
        "$inc": {
            "comment.$[outer].like": 1,
        }
    },
    {
        "arrayFilters": [
            { "outer._id":req.params.commentId }, 
           
        ]
    })
            .then((out)=>{
                    console.log("like updated")
                    res.json(out).status(200)
                })


    .catch(error=>{console.log(error) 
    res.status(500).send("err")})



    },

    //내 코멘트 보기api 같은거 필요없나?

    //코멘트 달면 응답으로 해당 포스트아이디도 주는데 저장했다가 삭제할때 줄수 있냐
    //restful한 이유로 바디를 못 준다면
    //엄밀한 의미에서 내 코멘트삭제라기보다 post에 대한 patch가 더 정확한 의미?!
    deleteCommentController:async(req,res)=>{
        Post.findById(req.body.postId)
        .then((doc)=>{
                    console.log(doc)
                    doc.comment.pull(req.params.commentId)
                
                doc.save()
                }).then((out)=>{
                    console.log("comment deleted")
                    res.status(200).json(out)
                })

    },
    
}