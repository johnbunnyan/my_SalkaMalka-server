const {isAuthorized,
    generateAccessToken,
    generateRefreshToken,
    checkRefeshToken
    
  } =require('./tokenMethod');


  
const {User} = require('../models/model')
const {Post} = require('../models/model')
const {Salkamalkaking} = require('../models/model')




module.exports = {
    comparePoint: (data) => {
//console.log(data.point)
        //방금 갱신된 회원의 총 점수 중에서  == data
        //SalkaMalkaKing 도큐먼트 (아래 참조)의 point와 비교했을 때 점수가 더 많은 회원이 있는지 확인

        // const newSalkamalkaking = { userId: "60e9244493463e1d1a46a7ad", point: 3};
        // const insertMe = new Salkamalkaking(newSalkamalkaking)
        // .save()

        Salkamalkaking.find({})
        .then((before)=>{
            //console.log(before)
            //console.log(data)
            //console.log(data.point)  
            
                if(before[0].point < data.point){
                    
                    Salkamalkaking.updateOne({_id:"default"},{
                        userId:data._id,
                        point:data.point

                    })
                    .then(() => Salkamalkaking.findOne({ _id:"default" }))
                    .then(doc => console.log(doc));
                }
                })




        //만약 현 살까말까킹보다 점수가 높은 회원이 있으면 → 살까말까킹에 그 회원의 유저아이디와 포인트 저장
      
      
      
      
      
        return null
    }


}