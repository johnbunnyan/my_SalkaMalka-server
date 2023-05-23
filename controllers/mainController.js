const { Post, Salkamalkaking } = require('../models/model');
let king ='';

module.exports = {
  mainController: async (req, res) => {
    const sort = req.query.sort;

    switch (sort) {
      case 'date':
        const query = {
          $project:
            {
              image: 1,
              isOpen: 1,
              sara: 1,
              mara: 1,
              ratio: 1,
              title: 1,
              content: 1,
              keyword:1,
              userId: 1,
              comment: 1,
              createdAt: 1,
              updatedAt: 1
            }
        }
        const sort = { $sort: { createdAt: -1 } };
        const orderByDate = await Post.aggregate([query, sort]);

        await Salkamalkaking.findOne({_id:"default"})
        .then((output)=>{
          king = output ? output.userId : ''
        })
        .then(()=>{
          if (orderByDate) {
            res.status(200).send({posts:orderByDate,Salkamalkaking:king});
          } else {
           res.status(500).send(err);
          }
        })
        break;

      case 'popular':
        const query1 = {
          $project:
            {
              image: 1,
              isOpen: 1,
              sara: 1,
              mara: 1,
              ratio: 1,
              title: 1,
              content: 1,
              keyword:1,
              userId: 1,
              comment: 1,
              createdAt: 1,
              updatedAt: 1,
              commentCount: { $add: [ "$sara", "$mara" ] }
            }
        };
        const sort1 = { $sort: { commentCount: -1 } };
        const orderByPopular = await Post.aggregate([query1, sort1]);
        Salkamalkaking.findOne({_id:"default"})
        .then((output)=>king = output ? output.userId : '')
        .then(()=>{
          if (orderByPopular) {
            res.status(200).send({posts:orderByPopular,Salkamalkaking:king});
          } else {
            res.status(500).send(err);
          }
        })
        break;

      case 'hot-topic':
        const query2 = {
          $project:
            {
              image: 1,
              isOpen: 1,
              sara: 1,
              mara: 1,
              ratio: 1,
              title: 1,
              content: 1,
              keyword:1,
              userId: 1,
              comment: 1,
              createdAt: 1,
              updatedAt: 1
            }
        };
        const sort2 = { $sort: { ratio: 1 } };
        const sort3 ={$match:{sara:{$gte:2}, mara:{$gte:2}}};
        const orderByHotTopic = await Post.aggregate([query2, sort2,sort3]);
        Salkamalkaking.findOne({_id:"default"})
        .then((output)=>king = output ? output.userId : '')
        .then(()=>{
          if (orderByHotTopic) {
            res.status(200).send({posts:orderByHotTopic,Salkamalkaking:king});
          } else {
            res.status(500).send(err);
          }
        })
        break;

      default:
        res.sendStatus(404);
        break;
    }
  },

  searchController: async (req, res) => {
    const queryString = decodeURI(decodeURIComponent(req.query.q));
    const searchResult = await Post.find({ title: { $regex: queryString } });
    if (searchResult) {
      res.status(200).send({ posts: searchResult });
    } else {
      res.status(500).send('err');
    }
  }
}