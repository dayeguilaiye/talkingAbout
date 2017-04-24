// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('./conf');
var $sql = require('./msgSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    addMsg: function(id, sentence) {
        pool.getConnection(function(err, connection) {
            // 建立连接，向表中插入值
            connection.query($sql.addMsg, [id, sentence], function(err, result) {
                if (result) {
                    result = {
                        code: 200,
                        msg: '增加成功'
                    };
                }
                console.log('成功添加新文本');
                // 释放连接 
                connection.release();
            });
        });
    },
    msgAll: function(callback) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.msgAll, function(err, result) {
                callback(result);
                connection.release();
            });
        });
    },
    deleteMsg: function(id) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.deleteMsg,id, function(err, result) {
                connection.release();
                console.log(id+'号文本已删除');
            });
        });
    },
    msgMy: function(id,callback) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.msgMy,id, function(err, result) {
                callback(result);
                connection.release();
            });
        });
    },
    msgById: function(id,callback) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.msgById,id, function(err, result) {
                callback(result);
                connection.release();
            });
        });
    },
    changew: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changew,[answer,sentence], function(err, result) {
                connection.release();
            console.log('w情感存储完毕--');
            });
        });
    },
    changen: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changen,[answer,sentence], function(err, result) {
                connection.release();
            console.log('n情感存储完毕--');
            });
        });
    },
    changeg: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changeg,[answer,sentence], function(err, result) {
                connection.release();
            console.log('g情感存储完毕--');
            });
        });
    },
    changec: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changec,[answer,sentence], function(err, result) {
                connection.release();
            console.log('分类存储完毕--');
            });
        });
    },
    changes: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changes,[answer,sentence], function(err, result) {
                connection.release();
            console.log('概述存储完毕--');
            });
        });
    },
    changek: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changek,[answer,sentence], function(err, result) {
                connection.release();
            console.log('关键词存储完毕--');
            });
        });
    }
};
