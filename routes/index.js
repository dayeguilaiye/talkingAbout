var express = require('express');
var querystring = require('querystring');
var request = require('request');
var http = require('http');
var userDao = require('../connection/userDao');
var msgDao = require('../connection/msgDao');
var analyse = require('../analyse/analyse');
var router = express.Router();


// var sentences;
// var gMood, nMood, wMood; //通用、新闻、微博情感偏向
// var keywords;
// var classify;
// var summary = new Array();

//bosonnlp
var bosonnlp = require('bosonnlp');
var nlp = new bosonnlp.BosonNLP('FQYME0i1.13275.6qylbnqN-gkK');

router.get('/login', function(req, res, next) {
    res.render('login');
});


//注册和登录页面的进入
router.get('/register', function(req, res, next) {
    res.render('register');
});
router.get('/login', function(req, res, next) {
    res.render('login');
});

//注册
router.post('/register', function(req, res, next) {
    var body = req.body;
    userDao.userById(body, function(ans1) { //先验证是否已有重复用户名
        if (ans1.status == '111') { //没有重复用户名
            userDao.addUser(body, function(ans2) { //进行添加
                if (ans2.status == '200') {
                    userDao.userById(body, function(ans3) {
                        if (ans3.status == 200) {
                            req.session.user = req.body.userName;
                            req.session.userId = ans3.id;
                            console.log(req.session.user + "注册成功");
                        }
                        res.send(ans3.status);
                    })

                }
            });
        } else { //用户名被占用
            res.send('113');
        }
    });


});

//登录
router.post('/login', function(req, res, next) {
    userDao.userById(req.body, function(ans) {
        if (ans.status == 200) {
            req.session.user = req.body.userName;
            req.session.userId = ans.id;
            console.log(req.session.user + "登录成功");
        }
        res.send(ans.status);
    });
});

//登出
router.get('/logout', function(req, res) {
    req.session.user = null;
    req.session.userId = null;
    console.log("登出成功");
    res.redirect('/login');
});

router.get('/all', function(req, res, next) {
    userDao.queryAll(req, res, next);

});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

//接收上传的文本
router.post('/upload', function(req, res, next) {
    console.log("Analysis starting...")
    var sentences = req.body.text;
    sentences = JSON.stringify(sentences);
    sentences.replace('\[', '\{');
    sentences.replace('\]', '\}');
    sentences = eval("(" + sentences + ")");
    var sArray = new Array();

    //如果只上传了一段文本，则是字符串格式而非数组，此处要转化为数组
    if (typeof(sentences) == 'string') {
        sArray[0] = sentences;
    } else {
        sArray = sentences;
    }
    //上传至服务器
    var i;
    for (i in sArray)
        msgDao.addMsg(req.session.userId, sArray[i]);

    res.render('uploaded');
    analyse.analyse(sArray, 0);
});

//直接访问uploaded页面
router.get('/uploaded', function(req, res, next) {
    res.render("uploaded");
});


//回应是否分析完毕
router.get('/isAnalyzed', function(req, res, next) {
    var i, finished = '1';
    msgDao.msgAll(function(result) {
        for (i = 0; i < result.length; i++) {
            if (!result[i].summary) {
                finished = '0';
                break;
            }
        }
        console.log('finished=' + finished);
        res.send(finished);
    })
});

//重新分析
router.get('/reAnalyze', function(req, res, next) {
    var sArray = new Array();
    var i = 0;
    msgDao.msgAll(function(result) {
        for (i = 0; i < result.length; i++) {
            sArray[i] = result[i].sentence;
        }
        analyse.analyse(sArray, 0);
    });
    res.send({ status: '200' });
});

//单文本重新分析
router.get('/singleReAnalyze', function(req, res, next) {
    var sArray = new Array();
    var i = 0;
    msgDao.msgById(req.query.msgid,function(result) {
        sArray[0] = result[0].sentence;
        analyse.analyse(sArray, 0);

    });
    res.send({ status: '200' });
});

//回传分析结果
router.get('/getAnalysis', function(req, res, next) {
    msgDao.msgMy(req.session.userId, function(result) {
        res.send(result);
    })
});

//删除一段文本
router.post('/deleteMsg', function(req, res, next) {
    msgDao.deleteMsg(req.body.id, function(result) {
        res.send(result);
    })
});

//单文本分析页面
router.get('/single', function(req, res, next) {
    console.log('请求浏览第' + req.query.msgid + '条消息的分析结果');
    res.render('single', { msgid: req.query.msgid });
});

//单文本分析结果
router.post('/getSingleMsg', function(req, res, next) {
    msgDao.msgById(req.body.msgid, function(result) {
        res.send(result);
    })
});


module.exports = router;

