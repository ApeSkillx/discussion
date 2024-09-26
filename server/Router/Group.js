const express = require('express');
const router = express.Router();
require('../DB/conn');
const SmdDivision = require('../DB/SMDDivision')
const Designation = require('../DB/Location')
const Group = require('../DB/Group')
const Division = require('../DB/Division')
const Institute = require('../DB/Institutes')
const User = require('../DB/module')
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb');
const Institutes = require('../DB/Institutes');


router.get('/user-details/:id', (req, res) => {
  User.findOne({ email: req.params.id }, { _id: 0, name: 1, designation:1, email: 1, Smdid: 1, Divisionid: 1, Group: 1, status: 1,institute:1, Hqrs:1, intrested: 1, starred: 1 })
    .then(resp => res.status(200).send(resp))
    .catch(e => res.status(400).send(e));
})

router.patch('/set-starred/:questionId/:userId', (req, res) => {
  User.findOne({ email: req.params.userId })
    .then(user => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Check if the questionId is already in the starred array
      if (user.starred.includes(req.params.questionId)) {
        return res.status(200).send(user); // Return the user without making changes
      }

      // Update the user document to push the questionId into the starred array
      User.updateOne(
        { email: req.params.userId },
        { $push: { starred: req.params.questionId } }
      )
        .then(() => {
          // Fetch the updated user document to send back in the response
          User.findOne({ email: req.params.userId })
            .then(updatedUser => {
              res.status(200).send(updatedUser);
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
});


router.patch('/remove-starred/:questionId/:userId', (req, res) => {
  User.findOneAndUpdate(
    { email: req.params.userId },
    { $pull: { starred: req.params.questionId } },
    { new: true } // This option returns the updated document
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(updatedUser);
    })
    .catch(error => res.status(400).send(error));
});


//Smd Details fetch
router.get('/smddetail', (req, res) => {
  SmdDivision.find({}, { name: 1 }).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

//SMD Updation
router.post('/updateSMD',(req,res)=>{

  const p_id = new ObjectId(req.body.smd1._id)
  const n_id = new ObjectId(req.body.smd)  
  

  if(req.body.inst1)
  {
    const id = new ObjectId(req.body.inst1._id)  
    Institute.updateOne({_id:id},{$pull:{member:req.body.auth}}).then((resp)=>{    
          User.updateOne({email:req.body.auth},{$set:{institute:'',Smdid:''}}).then((respo)=>{                 
              SmdDivision.updateOne({_id:n_id},{$push:{member:req.body.auth}}).then((respon)=>{
                  User.updateOne({email:req.body.auth},{$set:{Smdid:req.body.smd,Hqrs:2}}).then((response)=>{
                    res.status(200).send(response)
                  })
                })                      })    
         })  
  }
  
  else
  {
     SmdDivision.updateOne({_id:p_id},{$pull:{member:req.body.auth}}).then((resp)=>{       
    SmdDivision.updateOne({_id:n_id},{$push:{member:req.body.auth}}).then((respo)=>{
        User.updateOne({email:req.body.auth},{$set:{Smdid:req.body.smd}}).then((response)=>{
          res.status(200).send(response)
        })
    })
  })
  }



})



router.get('/smddetail1', (req, res) => {
  SmdDivision.find({division:{$ne:[]}}, { name: 1 }).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})
//Dvision details fetch
router.get('/smddetail/:id', (req, res) => {
  SmdDivision.find({ name: req.params.name }, { _id: 0, division: 1 }).limit(1).then((resp) => {

    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

router.get('/Group', (req,res)=>{
    Group.find({},{name:1,_id:1}).then((resp)=>{
        res.status(200).send(resp)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

router.get('/groupdetail/:name',(req,res)=>{

  const id = new ObjectId(req.params.name)  

    Group.findOne({_id:id},{_id:0,division:1}).then((resp)=>{
               
        Division.find({_id:resp.division}).then((resp)=>{
            res.send(resp)
        })

    })

})


/**************ALL Subject API***************/
router.get('/subject', (req, res) => {
  Division.find({}, { name: 1 }).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})
/*******************************************/

/*****************ALL Institute API*********/
router.get('/institute', (req, res) => {
  Institute.find({}, { name: 1 }).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})
/****************Institute Updation API*****************/
router.post('/updateInstitute',(req,res)=>{
  const p_id = new ObjectId(req.body.inst1._id)
  const n_id = new ObjectId(req.body.inst) 
  
  if(req.body.smd1)
  {
    const id = new ObjectId(req.body.smd1._id)
    SmdDivision.updateOne({_id:id},{$pull:{member:req.body.auth}}).then((resp)=>{ 
      Institute.updateOne({_id:n_id},{$push:{member:req.body.auth}}).then((respo)=>{
        User.updateOne({email:req.body.auth},{$set:{institute:req.body.inst,Smdid:req.body.smd,Hqrs:1}}).then((response)=>{
          res.status(200).send(response)
        })
    })
    })    
  }
  else
  {
    Institute.updateOne({_id:p_id},{$pull:{member:req.body.auth}}).then((resp)=>{       
      Institute.updateOne({_id:n_id},{$push:{member:req.body.auth}}).then((respo)=>{
          User.updateOne({email:req.body.auth},{$set:{institute:req.body.inst,Smdid:req.body.smd}}).then((response)=>{
            res.status(200).send(response)
          })
      })
    }) 
  }

 
})
/******************************************/

router.get('/SmdName/:id', (req, res) => { 
  const id = new ObjectId(req.params.id)
  SmdDivision.findOne({_id:id},{name:1}).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})


router.get('/Smdid/:id', (req, res) => {

const id = req.params.id

const idd = id.split(',')

  SmdDivision.find({_id:idd},{_id:0,name:1,division:1}).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

router.get('/InstituteName/:id', (req, res) => { 
  const id = new ObjectId(req.params.id)
  Institute.findOne({_id:id},{name:1}).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})



router.get('/SMD/:id', (req, res) => {  
  SmdDivision.findOne({division:req.params.id},{name:1}).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

//Group detail fetch from user collection
router.get('/group/:id', (req, res) => {

  User.findOne({ email: req.params.id }, {_id:0,intrested: 1})
    .then((resp) => {     
     Division.find({_id:resp.intrested}).then((rsp)=>{
      res.send(rsp)
     })

    }).catch((e) => {
      res.status(400).send(e)
    })
})

/******************Intrested Subject Updation*****************/
router.post('/updateSubject',(req,res)=>{ 
     Division.updateMany({_id:req.body.subject2},{$pull:{member:req.body.auth}}).then((resp)=>{
        Division.updateMany({_id:req.body.subject},{$push:{member:req.body.auth}}).then((respo)=>{
              User.updateMany({email:req.body.auth},{$set:{intrested:req.body.subject}}).then((response)=>{
                res.status(200).send(response)              
              })
        })
     })
})
/*************************************************************/

router.get('/MainGroup/:id', (req, res) => {
  User.findOne({ email: req.params.id }, {_id:0,Divisionid: 1})
    .then((resp) => {     
     Division.findOne({_id:resp.Divisionid}).then((rsp)=>{
      res.send(rsp)
     })

    }).catch((e) => {
      res.status(400).send(e)
    })
})


router.get('/main_group/:id', (req, res) => {
  User.find({ email: req.params.id }, { _id: 0, Group: 1 })
    .then((resp) => {
      resp.map((rsp) => {
        SmdDivision.find({ _id: rsp.Group }, { name: 1 })
          .then((grsp) => {
            res.send(grsp)
          })

      })
    })
})

router.get('/user-group',(req,res)=>{

  const id = new ObjectId(req.query.id_1)
  Division.findOne({_id:id},{member:1,name:1}).then((resp)=>{
       
    User.find({$and:[{email:resp.member},{email:{$ne:req.query.id_2}}]},{_id:0,email:1,name:1}).then((rsp)=>{
      res.status(200).send({rsp,resp})
    })

  }).catch((e)=>{
     res.status(400).send(e)
  })
})

router.get('/user-group-institute',(req,res)=>{

  const id = new ObjectId(req.query.id_1)
  Institute.findOne({_id:id},{member:1,name:1}).then((resp)=>{    
    User.find({$and:[{email:resp.member},{email:{$ne:req.query.id_2}}]},{_id:0,email:1,name:1}).then((rsp)=>{
      res.status(200).send({rsp,resp})
    })

  }).catch((e)=>{
     res.status(400).send(e)
  })
})


router.get('/smd-group',(req,res)=>{

  const id = new ObjectId(req.query.id_1)

  SmdDivision.findOne({_id:id},{name:1,division:1})
  
  .then((resp)=>{   
  
    Institute.find({_id:resp.division},{name:1,member:1}).then((rsp)=>{
      res.status(200).send({resp,rsp})

    })   
  
  }).catch((e)=>{
       res.status(400).send(e)
    })
})


module.exports = router;
