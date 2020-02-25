const express = require('express');

const router = express.Router();

let database = require('../data/helpers/projectModel.js');



//Route is based on host.com/api/project/
router.post('/', validateProject(), (req, res) => {
  console.log(req.body);

  database.insert({name:req.body.name, description:req.body.description, completed:req.body.completed || false })
    .then( data => {
      res.status(200).json(data);
    })
    .catch( err => { res.status(500).json({errorMessage:"There was an error creating a project."})})

});

router.get('/', (req, res) => {
  database.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the projects."})})
});

router.get('/:id', validateProjectID(), (req, res) => {

  database.get(req.project.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the project."})})
});

router.get('/:id/actions', validateProjectID(), (req, res) => {
  database.getProjectActions(req.project.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the project's actions."})})

});

router.delete('/:id', validateProjectID(), (req, res) => {
  database.remove(req.project.id)
    .then(data => {
      res.status(200).json({message:`removed ${data} record(s) from the database`});
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error deleting the project."})})

});

router.put('/:id', validateProjectID(), validateProject(), (req, res) => {


  database.update(req.project.id, {id: req.project.id, name: req.body.name, description: req.body.description, completed:req.body.completed || false})
    .then(data => {
      console.log(data);
      if(data){
        res.status(200).json({message:`Before: id: ${req.project.id}, name: ${req.project.name}, description: ${req.project.description}, completed: ${req.project.completed} | After: id: ${req.project.id}, name: ${req.body.name}, description: ${req.project.description}, completed: ${req.body.completed || false}`})
      } else {
        res.status(501).json({errorMessage:"There was an error updating the Project."});
      }
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an internal error updating the Project."})})

});

//custom middleware

function validateProjectID() {

  return (req, res, next) => {
    database.get(req.params.id)
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

function validateProject() {

  return (req, res, next) => {
    if(req.body){
      if(req.body.name){
        if(req.body.description){
          next();
      } else {
        res.status(400).json({errorMessage:"missing required description field"})
      }
      } else {
        res.status(400).json({errorMessage:"missing required name field"});
      }
    } else {
      res.status(400).json({errorMessage:"missing project data"});
    }
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
