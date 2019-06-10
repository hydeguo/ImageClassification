// var http = require('http'),
//   //  https = require('https'),
//     url = require('url'),
//     fileSystem = require('fs'),
//     path = require('path');

var multer  = require('multer');
var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var rootDir = "./data";
var async = require('async'); // https://github.com/caolan/async

app.use(router);
app.listen(8001); // use for upload

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
      destination: function (req, file, cb) {
            console.log(req.query["image-type"]);
            var typeIndex = req.query["image-type"];
            var packageName = req.query["packageName"];
            cb(null, rootDir + '/' + packageName + '/type-'+typeIndex+'/')
      },
    //给上传文件重命名，获取添加后缀名
    //  filename: function (req, file, cb) {
    //      var fileFormat = (file.originalname).split(".");
    //      cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    //  }
     filename: function (req, file, cb) {
     	 console.log('file.originalname====',file.originalname);
         var fileFormat = (file.originalname).split(".");
         cb(null, file.originalname);
     }
});
// 实例化上传模块(前端使用参数名为file)
var upload = multer({ storage: storage}).single('image');

// 单文件上传
router.post("/upload",upload,function(req,res,next){
    //  请求路径
    var url = global.baseURL+req.url;

    var obj = req.file;
    obj.path = rootDir + "/" + obj.path;
    console.log(obj);
    /*修改上传文件地址*/
    upload(req,res,function(err){
      if (err) {
          console.log('上传失败');
      }else{
          console.log('上传成功');
      }
    });

    // 反馈上传信息
    res.send({
          'states':'success',
          'url': obj.path
    });
});

router.post("/createPackage", function(req,res,next){
  var url = global.baseURL+req.url;
  console.log("Create Package: " + req.query.packageName);
  var dir = rootDir + "/" + req.query.packageName;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    for (var i = 1; i <= 5; i++){
      fs.mkdirSync(dir + "/type-" + i);
    }
    res.send({
        'states':'success',
        'remark':'already exist'
    });
  } else {
    res.send({
        'states':'success'
    });
  }
});

router.post("/createType", function(req,res,next){
  console.log("Package: " + req.query.packageName + " create type: " + req.query.type);
  var dir = rootDir + "/" + req.query.packageName + "/" + req.query.type;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    res.send({
        'states':'success',
        'remark':'already exist'
    });
  } else {
    res.send({
        'states':'success'
    });
  }
});


router.post("/removeFile", function(req,res,next){
  var dir = rootDir + "/" + req.query.packageName + '/type-'+req.query["image-type"]+"/" + req.query.fileName;
    console.log("removeFile: " + dir);
  if (fs.existsSync(dir)){
    try {
      console.log("existsSync: ...." );
      fs.unlinkSync(dir);
      res.send({
          'states':'success'
      });
    } catch(err) {
      console.error(err)
    }
  } else {
    res.send({
        'states':'success'
    });
  }
});


function getDirsSync(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

router.post("/listDataDir", function(req,res,next){
  console.log(req.query.packageName)
  var obj = getDirsSync(rootDir + "/" + req.query.packageName);
  console.log(obj);
  res.send({
      'states':'success',
      'dirname':obj
  });
});

router.get("/listFiles", function(req, res, next){
  console.log(req.query.dirname);
  fs.readdir(rootDir + "/" + req.query.packageName + "/" + req.query.dirname, function (err, files) {
    if (err) {
        console.log('Unable to scan directory: ' + err);
        res.send({
          'states':'fail'
        });
        return;
    }
    res.send({
      'states':'success',
      'files':files
    });
  });
});

router.get("/downloadTraining", function(req, res, next){
  console.log(req.query.packageName);
  if (typeof req.query.packageName === 'undefined') {
    res.send({
      'states':'fail',
      'message':'missing packageName'
    });
    return
  }
  var output = [];
  for (var i = 1; i <= 5; i++) {
    var files = fs.readdirSync(rootDir + "/" + req.query.packageName + "/type-" + i);
    files.forEach(function (file) {
      var obj = { "type" : i, "file" : file};
      output.push(obj);
    });
  }
  console.log(output);
  res.send({
      'states':'success',
      'output': output
  });
});


// var app = express();
// var fs = require('fs');
// app.listen(9441); // use for upload
//
// var upload = multer({ dest: 'upload/'});
// var type = upload.single('image');
//
// app.post('/upload', type, function (req,res) {
//   var tmp_path = req.files.recfile.path;
//   var target_path = 'uploads/' + req.files.recfile.name;
// fs.readFile(tmp_path, function(err, data)
// {
//   fs.writeFile(target_path, data, function (err)
//   {
//     res.render('complete');
//   })
// });
// });
