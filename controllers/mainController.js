/* option 
require("dotenv").config();
*/

const { User, Post } = require('../models/model');

module.exports = {
  mainController: async (req, res) => {
    const sort = req.query.sort;

    switch (sort) {
      case 'date':
        const orderByDate = await Post.find().sort({ createdAt: 1 });
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
        const query1 = {
          _id: 1,
          userId: 1,
          title: 1,
          image: 1,
          content: 1,
          isOpen: 1,
          comment: 1,
          commentCount: { $add: [ "$sara", "$mara" ] }
        };
        const sort1 = { commentCount: 'desc' };
        const orderByPopular = await Post.find().select(query1).sort(sort1);

        if (orderByPopular) {
          res.status(200).send(orderByPopular);
        } else {
          res.status(500).send(err);
        }

        break;

      case 'hotTopic':
        const query2 = { 
          _id: 1,
          userId: 1,
          title: 1,
          image: 1,
          content: 1,
          isOpen: 1,
          comment: 1
        };
        const sort2 = { saraToMara: 'asc' };
        const orderByHotTopic = await Post.find().select(query2).sort(sort2);

        if (orderByHotTopic) {
          res.status(200).send(orderByHotTopic);
        } else {
          res.status(500).send(err);
        }

        break;

      default:
        res.sendStatus(404);

        break;
    } 
  },

  searchController: async (req, res) => {
    const queryString = new RegExp(decodeURI(decodeURIComponent(req.query.q)));
    const searchResult = await Post.findOne({ title: queryString });

    if (searchResult) {
      res.status(200).send(searchResult);
    } else {
      res.status(500).send(err);
    }
  }
}