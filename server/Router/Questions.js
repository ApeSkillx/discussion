const express = require('express');
const router = express.Router();
require('../DB/conn');
const Question = require('../DB/Questions')
const Answer = require('../DB/Answers')
const User = require('../DB/module')
const Division = require('../DB/Division')
const Institute = require('../DB/Institutes')
const SmdDivision = require('../DB/SMDDivision')
const multer = require('multer');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb');
var fs = require('fs');
const crone = require('node-cron');
const { type } = require('os');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Uploads/questions')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('file')

router.post('/Question', upload, async (req, res) => {

  // console.log(req.body,req.file)

  const { title, body, auth, Imembers, Members, smdids, institutes, subject } = req.body;

  const created_at = new Date();
  const updated_at = new Date();

  const member = Members.split(',')
  const Imember = Imembers.split(',')
  const smdid = smdids.split(',')
  const institute = institutes.split(',')

  /* for upload the file     
     upload(req,res, function(err)
     {
         if (err) {
             return res.status(500).json(err)
         } 
 
         return res.status(200).send(req.file)
        
     }
     )
     This code for Check file uploaded or not
     */

  if (req.file) {
    const file = req.file.path

    try {
      const data = new Question({ auth, title, body, file, created_at, updated_at, subject, member, Imember, smdid, institute });
      const result = await data.save()

      if (result) {

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
      const data = new Question({ auth, title, body, created_at, updated_at, subject, member, Imember, smdid, institute });
      const result = await data.save()

      if (result) {

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

router.get('/selected-questions-division/:divisionName/:id', async (req, res) => {
  const divName = decodeURIComponent(req.params.divisionName)
  if ((divName.toLowerCase() == 'all') || (divName.toLowerCase() == '')) {
    //   User.findOne({ email: req.params.id }, { Smdid: 1, Divisionid: 1, intrested: 1, status: 1 })
    //     .then(userDetails => {
    //       if (userDetails.status == 1) {
    //         Division.find({ _id: { $in: [userDetails.Divisionid, ...(userDetails.intrested)] } })
    //           .then(resp => res.status(200).send(resp))
    //           .catch(err => res.status(400).send(err))
    //       }
    //       else if (userDetails.status == 2) {
    //         SmdDivision.findOne({ _id: userDetails.Smdid }).then(resp => {
    //           Division.find({ name: { $in: resp.division } })
    //             .then(resp => res.status(200).send(resp))
    //             .catch(err => res.status(400).send(err))
    //         }
    //         )
    //       }
    //       else if (userDetails.status == 3) {
    //         SmdDivision.find({})
    //           .then((resp) => { res.status(200).send(resp) })
    //           .catch((e) => { res.status(400).send(e) })
    //       }
    //     }
    //     )
  }
  else {
    Division.findOne({ name: divName }).then(div => {
      Question.find({ subject: div._id })
        .then(resp => {
          res.status(200).send(resp)
        })
        .catch(err => res.status(400).send(err))
    }
    )
      .catch(err => res.status(400).send(err))
  }
})

router.get('/user-questions-all/:id', async (req, res) => {
  Question.find({ auth: req.params.id })
    .sort({ created_at: -1 })
    .then(questionsFromDB => res.status(200).send(questionsFromDB))
    .catch(error => res.status(400).send(error));
})

router.get('/user-starred-questions/:id', (req, res) => {
  User.findOne({ email: req.params.id })
    .then(userDetails => {
      if (!userDetails || userDetails.starred.length === 0) {
        return res.status(200).send([]);
      }

      Question.find({ _id: { $in: userDetails.starred } })
        .then(starredQuestionsArray => {
          res.status(200).send(starredQuestionsArray);
        })
        .catch(error => {
          console.error("Error in finding these questions: ", error);
          res.status(500).send("An error occurred while processing your request.", error);
        });
    })
    .catch(error => {
      console.error("Error in retrieving user details: ", error);
      res.status(400).send(error);
    });
});



router.get('/Question/:id', async (req, res) => {


  let email = req.params.id


  User.aggregate([
    {
      $lookup: {
        from: 'questions',
        localField: 'Divisionid',
        foreignField: 'subject',
        as: 'result'
      }
    },
    {
      $match: { email: email }
    },

  ])
    .exec()
    .then((resp) => {

      return res.status(200).send(resp)

    })
    .catch((e) => {
      console.log("Error:", e)
      res.status(400).send(e)
    })


})

router.get('/all_question', (req, res) => {

  Question.find().sort({ created_at: -1 }).then((resp) => {

    return res.status(200).send(resp)

  })

})


router.get(`/questions_for_index_page`, async (req, res) => {
  try {
    //* Maybe sanitize these values first?
    const userEmailReq = req.query.userEmail;
    const subjectReq = req.query.subject || 'index';
    // const subjectReq = decodeURI(req.query.subject) || 'index';

    const userDetails = await User.findOne({ email: userEmailReq }, { starred: 0, password: 0 });

    const result = {
      userStatus: userDetails.status,
      subject: '',
      questions: [],
    };

    let orConditions = [];
    if ((userDetails.status == 1) && (userDetails.Hqrs == 1)) {
      orConditions = [
        { member: userDetails.Divisionid },
        { member: { $in: userDetails.intrested } },
        { member: userDetails.email },
        { auth: userDetails.email },
        { Imember: userDetails.institute },
        { Imember: userDetails.email },
      ];
    }
    else if ((userDetails.status == 2) || (userDetails.Hqrs == 2) || (userDetails.status == 1) || (userDetails.Hqrs == 1)) {
      orConditions = [
        { member: userDetails.Divisionid },
        { member: { $in: userDetails.intrested } },
        { member: userDetails.email },
        {$or:[{Imember:userEmailReq}]},
        { auth: userDetails.email },
        { smdid: userDetails.Smdid },
      ];
    }

    if ((['index', 'all', 'home'].includes(subjectReq.toLowerCase())) && (orConditions.length > 0)) {
      const questionsFromDB = await Question.find({ $or: orConditions }).sort({ updated_at: 1 });
      result.questions = questionsFromDB;
      result.subject = 'index';
    }
    else if (orConditions.length > 0) {
      const idArray = [];

      // const smd = await SmdDivision.findOne({ name: { $regex: new RegExp(subjectReq, 'i') } });
      // const div = await Division.findOne({ name: { $regex: new RegExp(subjectReq, 'i') } });
      // const inst = await Institute.findOne({ name: { $regex: new RegExp(subjectReq, 'i') } });
      const smd = await SmdDivision.findOne({ _id: subjectReq });
      const div = await Division.findOne({ _id: subjectReq });
      const inst = await Institute.findOne({ _id: subjectReq });

      //! When pusing data in 'idArray', the datatype must be string. Since smdid and memberid are stored as strings in question object.
      if (smd) {               
        const questionsFromDB = await Question.find({          
          $and: [
            {
              $or: [{smdid:`${smd._id}`},{Imember:userEmailReq},{ $and:[{smdid:`${smd._id}` },{ auth: userEmailReq }]}]
            },
            {
              $or: orConditions,
            },

          ],
        }).sort({ updated_at: 1 });

        result.questions = questionsFromDB;
        result.subject = smd.name;
      }
      if (div) {

        const questionsFromDB = await Question.find({
          $and: [
            {
              $or: [{ member: `${div._id}` }, { $and: [{ member: userEmailReq }, { subject: `${div._id}` }] }, { $and: [{ subject: `${div._id}` }, { auth: userEmailReq }] }]
            },
            {
              $or: orConditions,
            },
          ],
        }).sort({ updated_at: 1 });
        result.questions = questionsFromDB;
        result.subject = div.name;
      }
      if (inst) {
        const questionsFromDB = await Question.find({
          $and: [
            {
              $or: [{institute:`${inst._id}` },{ Imember: userEmailReq },{ $and: [{ Imember: `${inst._id}` }, { auth: userEmailReq }] }]
            },
            {
              $or: orConditions,
            },
          ],
        }).sort({ updated_at: 1 });
        result.questions = questionsFromDB;
        result.subject = inst.name;
      }
    }
    else {
      const questionsFromDB = await Question.find().sort({ updated_at: 1 });
      result.questions = questionsFromDB;
      result.subject = 'all';
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ 'error': 'Internal Server Error' });
  }
});

router.get('/subject_question', (req, res) => {
  // id1: divisionid, id2: email, id3: institute
  Question.find({ $or: [{ member: req.query.id_1 }, { member: req.query.id_2 }, { auth: req.query.id_2 }, { Imember: req.query.id_3 }, { Imember: req.query.id_2 }] }).then((resp) => {
    return res.status(200).send(resp)
  })

})

router.get('/subject_question_institute', (req, res) => {
  // id1: divisionid, id2: email, id3: smd
  Question.find({ $or: [{ member: req.query.id_1 }, { member: req.query.id_2 }, { auth: req.query.id_2 }, { smdid: req.query.id_3 }] }).then((resp) => {
    return res.status(200).send(resp)
  })

})

// router.get('/subject_question_smd', (req, res) => {

//   Question.find({ division: req.query.id_1 }).then((resp) => {
//     return res.status(200).send(resp)
//   })

// })


router.get('/Question-detail/:id', (req, res) => {


  const id = new ObjectId(req.params.id)


  Question.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: 'answers',
        localField: '_id',
        foreignField: 'question_id',
        as: 'result'
      }
    }

  ]).exec()
    .then((resp) => {

      return res.status(200).send(resp)

    })
    .catch((e) => {
      console.log("Error:", e)
      res.status(400).send(e)
    })
})


router.get('/group-question/:id', (req, res) => {


  Question.find({ group: req.params.id })
    .then((resp) => {
      return res.status(200).send(resp)
    })
    .catch((e) => {
      console.log("Error:", e)
      res.status(400).send(e)
    })
})

router.get('/get_Question/:id', (req, res) => {

  const id = new ObjectId(req.params.id)

  Question.find({ _id: id }).then((resp) => {
    return res.status(200).send(resp)
  }).catch(err => res.status(400).send(err));


})
router.get('/get_one_Question/:id', (req, res) => {

  const id = new ObjectId(req.params.id)

  Question.findOne({ _id: id })
    .then((resp) => { res.status(200).send(resp) })
    .catch(err => console.log(err));
})


/*******************Delete Post with all comment on Post**********************/
router.get('/deletepost/:id', (req, res) => {

  const id = new ObjectId(req.params.id)

  Answer.find({ question_id: id }, { _id: 0, file: 1 }).then((rsp) => {

    for (let i = 0; i < rsp.length; i++) {
      if (rsp[i].file) {
        fs.unlinkSync(rsp[i].file)
      }

    }
    Answer.deleteMany({ question_id: id }).then((rspo) => {
      //   return res.status(200).send(response)     
    })
    Question.findOne({ _id: id }, { _id: 0, file: 1 })
      .then((resp) => {
        if (resp.file) {
          fs.unlinkSync(resp.file)
        }
        Question.deleteOne({ _id: id }).then((response) => {
          return res.status(200).send(response)
        })
      })


  })



})

router.get('/Q_download/:id', (req, resp) => {

  const id = new ObjectId(req.params.id)

  Question.findOne({ _id: id }, { _id: 0, file: 1 }).then((response) => {

    return resp.download(response.file)
  })
    .catch((e) => {
      console.log("Error:", e)
      resp.status(400).send(e)
    })
})


/************************Delete Question Thread After 30 days if no activity in Post************************************/
const getdata = async () => {
  Question.find({}, { updated_at: 1, file: 1 }).then((resp) => {

    const time = new Date()

    let time_diff = []
    let day_diff = []
    let day_id = []
    let file = []

    for (i = 0; i < resp.length; i++) {
      time_diff = time.getTime() - resp[i].updated_at.getTime()

      day_diff.push(Math.ceil(time_diff / (1000 * 60 * 60 * 24)))

      if (day_diff[i] > 31) {
        day_id.push(resp[i]._id)

        file.push(resp[i].file)
      }
    }
    for (z = 0; z < day_id.length; z++) {
      if (file[z]) {

        Answer.find({ question_id: day_id[z] }).then((resp) => {
          for (let i = 0; i < resp.length; i++) {

            if (resp[i].file) {
              fs.unlinkSync(resp[i].file)
              Answer.deleteMany({ question_id: resp[i].question_id }).then(() => {                
                console.log('file has been deleted')
              })
                .catch((e) => {
                  console.log(e)
                })
            }
            else {
              Answer.deleteMany({ question_id: resp[i].question_id }).then(() => {               
                console.log('file has been deleted')
              })
                .catch((e) => {
                  console.log(e)
                })
            }
          }

        })
        fs.unlinkSync(file[z])
        User.updateMany({starred:day_id[z]},{$pull:{starred:day_id[z]}}).then((res)=>{
          console.log('Stared posts'+res)
        })
        Question.deleteMany({ _id:day_id[z]}).then((resp)=>{
          console.log('Posted Question'+resp)
        })
      }
      else {

        Answer.find({ question_id: day_id[z] }).then((resp) => {
          for (let i = 0; i < resp.length; i++) {

            if (resp[i].file) {
              fs.unlinkSync(resp[i].file)
              Answer.deleteMany({ question_id: resp[i].question_id }).then(() => {                
                console.log('file has been deleted')
              })
                .catch((e) => {
                  console.log(e)
                })
            }
            else {             
              Answer.deleteMany({ question_id: resp[i].question_id }).then(() => {
                
                console.log('file has been deleted')
              })
                .catch((e) => {
                  console.log(e)
                })
            }
          }
        })        
        User.updateMany({starred:day_id[z]},{$pull:{starred:day_id[z]}}).then((res)=>{
          console.log('Stared posts deleted')
        })
        Question.deleteMany({ _id: day_id[z]}).then((resp)=>{
          console.log('posts deleted')
        })
        
      }
    }
  })
}

getdata()

/*************************************************************************/
module.exports = router;
