var express = require('express');
const dbs = require('../models/dbs');
const dbErr = require("../models/errors");
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

/* GET Error List */
router.get('/errlist', function (req, res, next) {
  try {
    listdbs = [];
    dbErr.find({}, {}).then(function (ds) {
      listdbs = ds;
      
      console.log(listdbs);
      res.render('error_list', { title: 'errlst', model: {}, list: listdbs });
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


router.post('/db/test', async function (req, res, next) {
  let model = req.body;
  try {
    
    let dbClass = require("../utils/postgres");
    console.log(`postgresql://${model.username}:${model.password}@${model.host}:${model.port}/${model.database_name}${model.options}`);
    let dbGenerator = new dbClass(`postgresql://${model.username}:${model.password}@${model.host}:${model.port}/${model.database_name}${model.options}`);
    
    let auxdb = dbGenerator.getdb();
    const c = await auxdb.connect();
    c.done();
    auxdb.$pool.end();
    res.render('index', { title: 'DB', model: model, conexion: "Conexi??n Exitosa", list:[] });

  } catch (error) {
    console.log(error);
    res.render('index', { title: 'DB', model: model, error: "Error en la base", list:[] });
  }

});

router.get('/errlist/:id', function (req, res, next) {
  var io = req.app.get('socketio');
  try {
    listdbs = [];
    dbErr.deleteOne({_id: req.params.id}).then(function(numrRemoven){
      io.to("monitors").emit("sustract",{num: 1});
      res.redirect("/errlist");
    })

  } catch (error) {
    res.render('index', { title: 'DB', model: {}, error: "No se pudo borrar el Error", list:[] });
  }

});


router.get("/adderrors", function(req,res,next){

  try {
    var io = req.app.get('socketio');
    io.to("monitors").emit("sustract",{num: -1});
    res.status(200).json({msg: "gracias"});
  } catch (error) {
    res.status(500).json({msg: "no gracias"});
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
     
      var auxid = mod._id;
      delete mod._id;
      console.log(mod);
      dbs.findOneAndUpdate({ _id: auxid }, {host: mod.host, port: mod.port, database_name: mod.database_name,
      name: mod.name, username: mod.username, password: mod.password, options: mod.options}, { }).then(function (l) {
        console.log(l);
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
