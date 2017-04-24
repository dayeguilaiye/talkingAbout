var express = require('express');
var querystring = require('querystring');
var request = require('request');
var http = require('http');
var userDao = require('../connection/userDao')
var router = express.Router();


var sentences;
var gMood, nMood, wMood; //通用、新闻、微博情感偏向
var keywords;
var classify;
var summary = new Array();

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
    userDao.add(req, res, next);
});

//登录
router.post('/login',function(req,res,next){
    userDao.queryById(req,res,next);
    
});

//登出
router.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/login');
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

//接收上传的文本
router.post('/upload', function(req, res, next) {
	console.log("Analysis starting...")
    sentences = req.body.text;
    sentences = JSON.stringify(sentences);
    sentences.replace('\[', '\{');
    sentences.replace('\]', '\}');
    sentences = eval("(" + sentences + ")");
    getw(res);
});
//just for test`
router.get('/upload', function(req, res, next) {
    sentences = ['噗。就是说南北朝人民审美不一样。韩国就提出来代表了一下。你也太认真了吧。哈哈哈哈。我妈就这种脸型。大部分人可能都不喜欢这种脸型吧。我遗传了我爸的下颚骨。不然我可能也会去削了',
    '4月6日下午，电子科技大学第七届教代会、第十二届工代会第四次会议在清水河校区隆重召开。校党委书记王亚非、校长李言荣，余敏明、罗佳慧、朱宏、熊彩东、申小蓉、胡皓全、曾勇等校领导，220位教代会、工代会代表以及80余位特邀代表和列席代表参加大会。大会由校工会常务副主席周涛主持。'];
    gMood=[[0.7975916107015577, 0.2024083892984423], [0.9084103473628776, 0.09158965263712238]];
    wMood=[[0.6752084234630512, 0.3247915765369488], [0.7866894402691901, 0.21331055973080995]];
    nMood=[[0.8321513366216028, 0.1678486633783972], [0.9467610764310377, 0.05323892356896237]];
    classify=[11, 6];
    keywords=[[[0.5006393914196234, "脸型"], [0.4846571876385622, "下颚骨"], [0.34936285990011934, "哈哈"], [0.2866621851733657, "南 北朝"], [0.247460969166565, "遗传"], [0.2164743244252507, "审美"], [0.15959842826061038, "认真"], [0.15083891476984318, "可能"], [0.14614878800300385, "人民"], [0.1452687448113286, "韩国"], [0.1184473336305388, "噗"], [0.11181475431599333, "出来"], [0.10864819200103128, "代表"], [0.10260842186002457, "喜欢"], [0.10063731556785044, "一样"], [0.09667404121814499, "削"], [0.08525152917754994, "爸"], [0.07475351984833128, "妈"], [0.07362747648968301, "我"], [0.07357315805182134, "就是说"], [0.07019922837523762, "吧"], [0.0644682569772507, "不然"], [0.05819640859512558, "提"], [0.038325399965706504, "这种"], [0.0312797393445816, "太"], [0.02825916064734502, "去"], [0.027771572739658464, "就"], [0.02614429962117619, "了"], [0.023348484987246208, "你"], [0.022999735178882704, "也"], [0.02103851953302012, "不"], [0.016370712700589478, "人"], [0.016080604810090552, "会"], [0.014478914520308965, "都"]], [[0.47247486726214205, "工代会"], [0.47247486726214205, "教代会"], [0.19143689979987633, "校党委"], [0.18831578260327025, "清水河"], [0.16928556827722102, "校领导"], [0.16536620354174972, "余敏明"], [0.16536620354174972, "罗佳慧"], [0.16536620354174972, "熊彩东"], [0.16536620354174972, "胡皓 全"], [0.16536620354174972, "申小蓉"], [0.16536620354174972, "李言荣"], [0.16536620354174972, "王亚非"], [0.16320506439901333, "大会"], [0.1588758242008415, "代表"], [0.15099823163950632, "朱宏"], [0.15057523104313486, "列席"], [0.13663025973726287, "曾勇"], [0.12535418063348536, "特邀"], [0.118899078846179, "工会"], [0.11712196224373171, "周涛"], [0.11321197338998837, "校区"], [0.10607167929850356, "校长"], [0.10517773672566089, "常务"], [0.09689409989517093, "隆重"], [0.09415310812478556, "书记"], [0.08829832679102241, "主持"], [0.0740287009195861, "召开"], [0.07078997760568431, "主席"], [0.06928550175042805, "会议"], [0.06243135619708343, "6日"], [0.06192104983058256, "电子"], [0.059086053858965, "大学"], [0.05126306161471942, "参加"], [0.049718271955237855, "4月"], [0.049419289743103, "下午"], [0.044478544867830275, "届"], [0.038597527672506605, "校"], [0.03827068884160332, "科技"], [0.027880877530831936, "位"], [0.020196259941451095, "副"], [0.013934752145493626, "由"], [0.01085854107779486, "次"], [0.008610389082986421, "等"], [0.0031986565759833663, "在"], [0.002424076865990505, "和"]]];
    summary=[ '"噗。\\n就是说南北朝人民审美不一样。\\n大部分人可能都不喜欢这种脸型吧。"',
  '"4月6日下午，电子科技大学第七届教代会、第十二届工代会第四次会议在清水河校区隆重召开。"' ]
    res.render("uploaded");
});

//回传分析结果
router.get('/getAnalysis', function(req, res, next) {
    mood = [
        [0.8, 0.2],
        [0.4, 0.6]
    ];
    var ans = {
        'status': '200',
        'sentences': sentences,
        'gMood': gMood,
        'nMood': nMood,
        'wMood': wMood,
        'classify': classify,
        'summary': summary,
        'keywords':keywords
    };
    console.log(ans.moods);
    res.send(JSON.stringify(ans));
});

function getw(res) {
    //微博
    request({
        url: 'http://api.bosonnlp.com/sentiment/analysis?weibo',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            wMood = body;
            console.log(body);
            getn(res);
        }
    });
}

function getn(res) {
    //新闻
    request({
        url: 'http://api.bosonnlp.com/sentiment/analysis?news',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            nMood = body;
            console.log(body);
            getg(res);
        } else {
            console.log(error);
            console.log(response.statusCode);
        }
    });
}

function getg(res) {
    //通用
    request({
        url: 'http://api.bosonnlp.com/sentiment/analysis',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            gMood = body;
            console.log(body);
            getc(res);
        } else {
            console.log(error);
            console.log(response.statusCode);
        }
    });
}

function getc(res) {
    //分类
    request({
        url: 'http://api.bosonnlp.com/classify/analysis',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            classify = body;
            console.log(body);
            getk(res);
        } else {
            console.log(error);
            console.log(response.statusCode);
        }
    });

}

function getk(res) {
    //关键词
    request({
        url: 'http://api.bosonnlp.com/keywords/analysis',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            keywords = body;
            console.log(body);
            gets(0, res);
        } else { 
        	console.log(error);
            console.log(response.statusCode); }
    });
}

function gets(i, res) {
    //摘要
    if (i == sentences.length) {
        console.log(summary);
        res.render('uploaded');
        return;
    }
    var package = {
        'no_exeed': 0,
        'percentage': 0.2,
        'title': '',
        'content': sentences[i]
    };
    request({
        url: 'http://api.bosonnlp.com/summary/analysis',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(package)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            summary.push(body);console.log(body);
            i++;
            gets(i, res);
        } else { 
        	console.log(error);
            console.log(response.statusCode); }
    });
}





module.exports = router;
