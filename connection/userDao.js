// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('./conf');
var $sql = require('./userSqlMapping');

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
    addUser: function(param,callback) {
        pool.getConnection(function(err, connection) {
            var ans = {'status':'','id':''};
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.addUser, [param.userName, param.password], function(err, result) {
                ans.status = '200';
                // 释放连接 
                connection.release();
                callback(ans);
            });
        });

    },
    delete: function(req, res, next) {
        // delete by Id
        pool.getConnection(function(err, connection) {
            var id = +req.query.id;
            connection.query($sql.delete, id, function(err, result) {
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function(req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        var param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }

        pool.getConnection(function(err, connection) {
            connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
                // 使用页面进行跳转提示
                if (result.affectedRows > 0) {
                    res.render('suc', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('fail', {
                        result: result
                    });
                }

                connection.release();
            });
        });

    },
    userById: function(body,callback) {
        var userName = body.userName;
        var ans = {'status':'','id':''};
        pool.getConnection(function(err, connection) {
            connection.query($sql.userById, userName, function(err, result) {
                if (!result[0] || !result[0].password) {
                    ans.status='111';//未检测到该用户名
                } else if (body.password != result[0].password) {
                    ans.status='112';//存在该用户名，但与密码不匹配
                } else {
                    // var user = { 'username': userName };
                    // req.session.user = user;

                    ans.status='200';//用户名与密码匹配
                    ans.id=result[0].userID;
                }
                callback(ans);
            });
        });
        return ans;

    },
    queryAll: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
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
    msgMy: function(id,callback) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.msgMy,id, function(err, result) {
                callback(result);
                connection.release();
            });
        });
    },
    changew: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changew,[answer,sentence], function(err, result) {
                connection.release();
            console.log('w情感分析完毕');
            });
        });
    },
    changen: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changen,[answer,sentence], function(err, result) {
                connection.release();
            });
        });
    },
    changeg: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changeg,[answer,sentence], function(err, result) {
                connection.release();
            });
        });
    },
    changec: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changec,[answer,sentence], function(err, result) {
                connection.release();
            });
        });
    },
    changes: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changes,[answer,sentence], function(err, result) {
                connection.release();
            });
        });
    },
    changek: function(sentence,answer){
        pool.getConnection(function(err, connection) {
            connection.query($sql.changek,[answer,sentence], function(err, result) {
                connection.release();
            });
        });
    }
};
