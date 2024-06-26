const express = require('express');
const router = express.Router();
require('../DB/conn');
const Answer = require('../DB/Answers')
const Reply = require('../DB/Replies')
const User = require('../DB/module')
const Question = require('../DB/Questions')
const multer = require('multer')
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Uploads/answers')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single('file')

router.post('/Answer', upload, async (req, res) => {

    const { question_id, body, auth, file } = req.body;

    const created_at = new Date(); 
    
    const postdata = await Question.updateOne({ _id: question_id},{$set:{updated_at:created_at}});    

    User.updateMany({'message.post_id':question_id},{$set:{'message.$[el].seen':false}},{arrayFilters:[{'el.post_id':question_id}]}).then((resp)=>{
        
      })

    if (req.file) {
        const file = req.file.path       

        try {           

            const data = new Answer({ question_id, body, auth, file, created_at });

            const result = await data.save()

            if (result && postdata) {
                res.status(200).json({ message: 'inserted' })
            }
            else {
                console.log('error')
                return res.status(402).json({ err: 'not inserted' })
            }
        }
        catch (err) {
            console.log(err);
        }

    }
    else {

        try {
            const data = new Answer({ question_id, body, auth, created_at });
            const result = await data.save()
            if (result && postdata) {
                res.status(200).json({ message: 'inserted' })
            }
            else {
                console.log('error')
                return res.status(402).json({ err: 'not inserted' })
            }
        }
        catch (err) {
            console.log(err);
        }



    }


})

router.get('/user-answers-all/:id', async(req, res)=>{
  Answer.find({auth: req.params.id})
    .sort({created_at:-1})
    .then(answersFromDB => res.status(200).send(answersFromDB))
    .catch(error => res.status(400).send(error));
})

/****************Fetch Answer from Answer collection************************/
router.get('/Answer-detail/:id', (req, res) => {

    const id = new ObjectId(req.params.id)

    Answer.find({ question_id: id }, {}).then((resp) => {
        // console.log('Answer details fetched: ',JSON.stringify(resp));
        res.status(200).send(resp)
    }).catch((err) => {
        res.status(400).send(e)
    })
})
/*****************************************************************************/

/****************Patch Answer from Answer collection for replies************************/
router.patch('/Answer-reply/:id', async(req, res) => {

    const id = new ObjectId(req.params.id)

    const replyData = {
        replied_to: req.body.replied_to,
        body: req.body.body,
        auth: req.body.auth,
        replies: req.body.replies,
        created_at: req.body.created_at,
    }

    User.updateMany({'message.post_id':req.body.question_id},{$set:{'message.$[el].seen':false}},{arrayFilters:[{'el.post_id':req.body.question_id}]}).then((resp)=>{
       
      })

    const postdata = await Question.updateOne({ _id:req.body.question_id},{$set:{updated_at:req.body.created_at}}); 
    const newReply = new Reply(replyData);
    Answer.findOneAndUpdate(
        { _id: id },
        { $push: { comments: newReply } },
        { new: true }
    ).then((resp) => {
        res.status(200).send(resp)
    }).catch((err) => {
        res.status(400).send(e)
    })
})
/****************Patch Answer from Answer collection for nested replies************************/
router.patch('/Reply-reply/:id', async (req, res) => {
    const id = new ObjectId(req.params.id);
    const replyData = {
        replied_to: req.body.replied_to,
        body: req.body.body,
        auth: req.body.auth,
        replies: req.body.replies,
        created_at: req.body.created_at,
    };
   const newReply = new Reply(replyData);



    try {
        let answer = await Answer.findById(id);

        if (!answer) {
            return res.status(404).send('Comment not found');
        }

        const newRepliedTo = replyData.replied_to.slice(1);

        let targetReply = answer.comments;
        for (const replyId of newRepliedTo) {
            const foundReply = targetReply.find(reply => reply._id.equals(replyId));
            if (!foundReply) {
                return res.status(404).send('Parent reply not found');
            }
            targetReply = foundReply.replies;
        }

        targetReply.push(newReply);

        // answer = await answer.save(); // This did not worked
        
        User.updateMany({'message.post_id':answer.question_id},{$set:{'message.$[el].seen':false}},{arrayFilters:[{'el.post_id':answer.question_id}]}).then((resp)=>{
          
          // req.body.question_id does not work because req.body is currently reply object not answer object (reply obj does not contain question_id but answer obj does),
          // to get answer's question_id we do answer.question_id.
          // at line 147 we are fetching the answer to which user has replied to
          // now the constant named 'answer' holds the answer object. Now we can use the answer objects and values inside it.
            
          })
        

        await Question.updateOne({ _id:req.body.question_id},{$set:{updated_at:req.body.created_at}}); 
        await Answer.updateOne({ _id: id }, answer);


        res.status(200).send('Reply added successfully');
    } catch (error) {
        res.status(500).send('Error adding reply');
    }
});

/*****************************************************************************/

/***********************Download the attachment from Answer Collection****************************/

router.get('/A_download/:id', (req, res) => {

    const id = new ObjectId(req.params.id)

    Answer.findOne({ _id: id }, { _id: 0, file: 1 }).then((response) => {
        return res.download(response.file)
    })
        .catch((e) => {
            console.log("Error:", e)
            res.status(400).send(e)
        })
})



/******************************************************************************/

module.exports = router;