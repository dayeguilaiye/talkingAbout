
var request = require('request');
var msgDao = require('../connection/msgDao');

function analyse(sentences, n) {
    getw(sentences, n);
}

function getw(sentences, n) {
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
                var wMood = eval('(' + body + ')');
                msgDao.changew(sentences[n], wMood[0][0]);
                getn(sentences, n);
            }else{
                console.log('???????????'+error);
            }
        });
    }

    function getn(sentences, n) {

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
                msgDao.changen(sentences[n], nMood[0][0]);
                getg(sentences, n);
            }
        });
    }

    function getg(sentences, n) {
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
                msgDao.changeg(sentences[n], gMood[0][0]);
                getc(sentences, n);
            }
        });
    }

    function getc(sentences, n) {
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
            console.log('新闻类型分类完成');
            var classify = eval('(' + body + ')');
            if (!error && response.statusCode == 200) {
                msgDao.changec(sentences[n], classify[0]);
                getk(sentences, n);
            }
        });

    }

    function getk(sentences, n) {
        //关键词
        request({
            url: 'http://api.bosonnlp.com/keywords/analysis?top_k=10',
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
                msgDao.changek(sentences[n], body);
                gets(sentences, n);
            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        });
    }

    function gets(sentences, n) {
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
                msgDao.changes(sentences[n], body);
                getw(sentences, n + 1);
            } else {
                console.log(error);
                console.log(response.statusCode);
            }
        });
    }
exports.analyse = analyse;