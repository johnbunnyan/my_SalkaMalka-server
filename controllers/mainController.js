/* option 
require("dotenv").config();
*/
  
const { User, Post } = require('../models/model');

module.exports = {
  mainController: async (req, res) => {
    const sort = req.query.sort;

    switch (sort) {
      case 'date':
        const orderByDate = await Post.find().sort({ createdAt: 1 }).pretty();
        // {
        //   _id, // postId
        //   userId,
        //   title,
        //   image,
        //   content,
        //   isOpen,
        //   comment: [
        //     {
        //       _id,
        //       type,
        //       like,
        //       content,
        //       userId: { $ref, $id, $db }
        //     }
        //   ],
        //   sara, 사라는 투표 수
        //   mara, 마라는 투표 수
        //   saraToMara = Math.abs((sara / mara) - 1)
        // }

        if (orderByDate) {
          res.status(200).send(orderByDate);
        } else {
         res.status(500).send(err);
        }
        
        break;

      case 'popular':
        const query = { $project: {
          _id: 1,
          userId: 1,
          title: 1,
          image: 1,
          content: 1,
          isOpen: 1,
          comment: 1,
          commentCount: { $add: [ "$sara", "$mara" ] } } 
        };
        const sort = { $sort: { commentCount: -1 } };
        const orderByPopular = await Post.aggregate([ query, sort ]).pretty();

        if (orderByPopular) {
          res.status(200).send(orderByPopular);
        } else {
          res.status(500).send(err);
        }

        break;

      case 'hotTopic':
        const query = { $project: {
          _id: 1,
          userId: 1,
          title: 1,
          image: 1,
          content: 1,
          isOpen: 1,
          comment: 1
        }};
        const sort = { $sort: { saraToMara: -1 } };
        const orderByHotTopic = await Post.aggregate([ query, sort ]).pretty();

        if (orderByHotTopic) {
          res.status(200).send(orderByHotTopic);
        } else {
          res.status(500).send(err);
        }

        break;

      default:
        res.status(404).send();

        break;
    } 
  },

  searchController: async (req, res) => {
    const queryString = req.query.q;
    const searchResult = await Post.find({ title: { $regex: `${queryString}` } }).pretty();

    if (searchResult) {
      res.status(200).send(searchController);
    } else {
      res.status(500).send(err);
    }
  }
}