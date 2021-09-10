var express = require('express');
const dbs = require('../models/dbs');
var router = express.Router();



/* GET home page. */
router.get('/db', function (req, res, next) {
  try {
    listdbs = [];
    dbs.find({}, {}).then(function (ds) {
      listdbs = ds;
      console.log(ds);
      console.log(listdbs);
      res.render('index', { title: 'DB', model: {}, list: listdbs });
    });

  } catch (error) {
    res.render('index', { title: 'DB', model: {}, error: "Error en la base", list:[] });
  }

});

router.get('/db/:id', function (req, res, next) {
  try {
    console.log(req.params.id);
    dbs.findOne({_id: req.params.id}, {}).then(function (ds) {
     
      console.log(ds);
     
      res.render('index', { title: 'DB', model: ds, list: [] });
    });

  } catch (error) {
    res.render('index', { title: 'DB', model: {}, error: "Error en la base", list:[] });
  }

});

router.get('/db/:id/delete', function (req, res, next) {
  try {
    
    dbs.deleteOne({ _id: req.params.id }, { }).then(function (numRemoved) {
      
        
        console.log("delete correctly");
        res.redirect("/db");
      
      // numRemoved = 3
      // All planets from the solar system were removed
    });

  } catch (error) {
    console.log(error);
    res.render('index', { title: 'DB', model: {}, error: "Error en la base", list:[] });
  }

});


router.post('/db/test', function (req, res, next) {
  try {
    let model = req.body;
    let dbClass = require("../utils/postgres");
    console.log(`postgresql://${model.username}:${model.password}@${model.host}:${model.port}/${model.database}`);
    let dbGenerator = new dbClass(`postgresql://${model.username}:${model.password}@${model.host}:${model.port}/${model.database}`);
    
    let auxdb = dbGenerator.getdb();
    auxdb.$pool.end();
    res.render('index', { title: 'DB', model: model, conexion: "Conexión Exitosa", list:[] });

  } catch (error) {
    console.log(error);
    res.render('index', { title: 'DB', model: model, error: "Error en la base", list:[] });
  }

});






router.post('/db', function (req, res, next) {
  try {
    console.log(req.body);
    let mod = req.body;
    if(mod._id == ""){
      delete mod._id;
      dbs.create(
        mod
      ).save().then(function(L){
        console.log("save correctly");
        res.redirect("/db");
      });
    }else{
      dbs.findOneAndUpdate({ _id: mod._id }, mod, { upsert: true }).then(function (l) {
        console.log("update correctly");
        res.redirect("/db");
      });
    }
    
    
  } catch (error) {
    console.log(error);
    res.render('index', { title: 'DB', model: {}, error: "No se pudo crear la base", list:[] });
  }

})

module.exports = router;