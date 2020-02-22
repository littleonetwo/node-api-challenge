const express = require('express');

const router = express.Router();

let database = require('../data/helpers/actionModel.js');
let projectDatabase= require('../data/helpers/projectModel.js');

//Route is based on host.com/api/action/

router.post('/:id', validateProjectID(), validateAction(), (req, res) => {
  let newAction = {description:req.body.description, project_id:req.project.id, notes:req.body.notes, completed:req.body.completed || false};

  database.insert(newAction)
    .then( data => {
      res.status(200).json(data);
    })
    .catch( err => { res.status(500).json({errorMessage:"There was an error creating an Action."})})

});

router.get('/', (req, res) => {
  database.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the Actions."})})
});

router.get('/:id', validateActionID(), (req, res) => {

  database.get(req.action.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the Action."})})
});

router.delete('/:id', validateActionID(), (req, res) => {
  database.remove(req.action.id)
    .then(data => {
      res.status(200).json({message:`removed ${data} record(s) from the database`});
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error deleting the Action."})})

});

router.put('/:id', validateActionID(), validateAction(), (req, res) => {
  let newAction = {id:req.action.id, project_id:req.action.project_id, description:req.body.description, notes:req.body.notes, completed:req.action.completed || false};
  // console.log(req.action);
  // console.log(newAction);
  database.update(req.action.id, newAction)
    .then(data => {
      // console.log(data);
      if(data){
        res.status(200).json({message:`Before: id: ${req.action.id}, project_id: ${req.action.project_id}, description: ${req.action.description}, completed: ${req.action.completed} | After: id: ${newAction.id}, project_id: ${newAction.id}, description: ${newAction.description}, completed: ${newAction.completed}`})
      } else {
        res.status(501).json({errorMessage:"There was an error updating the Action"});
      }
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an internal error updating the Action."})})

});

//custom middleware

function validateProjectID() {

  return (req, res, next) => {
    projectDatabase.get(req.params.id)
      .then(data =>{
        if(data){
          req.project = data;
          next();
        } else {
          res.status(400).json({errorMessage:"invalid project id"});
        }
      })
      .catch(err => res.status(500).json({errorMessage:"Error while searching for project ID"}))
  }
}

function validateActionID() {

  return (req, res, next) => {
    database.get(req.params.id)
      .then(data =>{
        if(data){
          req.action = data;
          next();
        } else {
          res.status(400).json({errorMessage:"invalid action id"});
        }
      })
      .catch(err => res.status(500).json({errorMessage:"Error while searching for action ID"}))
  }
}

function validateAction() {

  return (req, res, next) => {
    if(req.body){
      if(req.body.description && req.body.description.length <= 128){
        if(req.body.notes){
          next();
        } else {
          res.status(400).json({errorMessage:"missing required notes field"})
        }
      } else {
        res.status(400).json({errorMessage:"missing required description field or your description must be shorter than 128 characters."})
      }

    } else {
      res.status(400).json({errorMessage:"missing Action data"});
    }
  }

}


module.exports = router;
