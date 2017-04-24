// CRUD SQL语句
var user = {
    addUser: 'INSERT INTO users(userName, password) VALUES(?,?)',
    updateUser: 'update users set name=?, age=? where id=?',
    deleteUser: 'delete from users where id=?',
    userById: 'select * from users where userName=?',
    queryAll: 'select * from users'
};

module.exports = user;
