var msg = {
    addMsg:'INSERT INTO msgs(userID, sentence) VALUES(?,?)',
    deleteMsg:'delete from msgs where msgID=?',
    msgAll:'select * from msgs',
    msgMy:'select * from msgs where userID=?',
    msgById:'select * from msgs where msgID=?',
    changew:'update msgs set wMood=? where sentence=?',
    changen:'update msgs set nMood=? where sentence=?',
    changeg:'update msgs set gMood=? where sentence=?',
    changec:'update msgs set classify=? where sentence=?',
    changes:'update msgs set summary=? where sentence=?',
    changek:'update msgs set keywords=? where sentence=?'
}

module.exports = msg;