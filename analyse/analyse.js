var request = require('request');
var msgDao = require('../connection/msgDao');

function analyse(sentences, n) {
    getw(sentences, n);
}

function getw(sentences, n) {
    console.log('开始w情感分析...----'+n);
    //微博
    if (n == sentences.length) {
        console.log('全部分析完毕');
        return;
    }
    request({
        url: 'http://api.bosonnlp.com/sentiment/analysis?weibo',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences[n])
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('w情感分析完毕');
            var wMood = eval('(' + body + ')');
            msgDao.changew(sentences[n], wMood[0][0], function() {
                getn(sentences, n);
            });
        } else {
            console.log('w情感分析错误!!!' + error);
            console.log('正在重试');
            getw(sentences, n);
        }
    });
}

function getn(sentences, n) {
    console.log('开始n情感分析...');
    //新闻
    request({
        url: 'http://api.bosonnlp.com/sentiment/analysis?news',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences[n])
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('n情感分析完毕');
            var nMood = eval('(' + body + ')');
            msgDao.changen(sentences[n], nMood[0][0], function() {
                getg(sentences, n);
            });

        } else {
            console.log('n情感分析错误!!!' + error);
            console.log('正在重试');
            getn(sentences, n);
        }
    });
}

function getg(sentences, n) {
    console.log('开始g情感分析...');
    //通用
    request({
        url: 'http://api.bosonnlp.com/sentiment/analysis',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences[n])
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('g情感分析完毕');
            var gMood = eval('(' + body + ')');
            msgDao.changeg(sentences[n], gMood[0][0], function() {
                getc(sentences, n);
            });

        } else {
            console.log('n情感分析错误!!!' + error);
            console.log('正在重试');
            getg(sentences, n);
        }
    });
}

function getc(sentences, n) {
    console.log('开始分类...');
    //分类
    request({
        url: 'http://api.bosonnlp.com/classify/analysis',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences[n])
    }, function(error, response, body) {
        console.log('分类完成');
        var classify = eval('(' + body + ')');
        if (!error && response.statusCode == 200) {
            msgDao.changec(sentences[n], classify[0], function() {
                getk(sentences, n);
            });

        } else {
            console.log('分类错误!!!' + error);
            console.log('正在重试');
            getc(sentences, n);
        }
    });

}

function getk(sentences, n) {
    console.log('开始解析关键词...');
    //关键词
    request({
        url: 'http://api.bosonnlp.com/keywords/analysis?top_k=30',
        method: "POST",
        headers: {
            "content-type": "application/json",
            'X-Token': 'FQYME0i1.13275.6qylbnqN-gkK',
            'Accept': 'application/json'
        },
        body: JSON.stringify(sentences[n])
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('关键词解析完毕');
            msgDao.changek(sentences[n], body, function() {
                gets(sentences, n);
            });

        } else {
            console.log('关键词分析错误!!!' + error);
            console.log('正在重试');
            getk(sentences, n);
        }
    });
}

function gets(sentences, n) {
    console.log('获取摘要...');
    //摘要
    var package = {
        'no_exeed': 0,
        'percentage': 0.2,
        'title': '',
        'content': sentences[n]
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
            console.log('获取摘要成功');
            msgDao.changes(sentences[n], body, function() {
                getw(sentences, n + 1);
            });
        } else {
            console.log('摘要分析错误!!!' + error);
            console.log('正在重试');
            gets(sentences, n);
        }
    });
}
exports.analyse = analyse;
