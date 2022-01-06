/*
 * @Description:
 * @Autor: fylih
 * @Date: 2021-05-10 14:47:00
 * @LastEditors: fylih
 * @LastEditTime: 2021-05-14 18:34:58
 */
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //这里最好不用*通配符，之前就这报错，写上指定域名例如 http://127.0.0.1:8080
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-control-Allow-Credentials", "true");
    //这个地方是最坑了，百度查了好多大佬给的方案都没加这条，报错一直报这个，加上就ok
    next();
})
var userDB = require('./nedb.js')('user')
var scoreDB = require('./nedb.js')('score')
var nameRule = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
var pwdRule = /^[A-Za-z0-9]+$/
app.post('/register', function (req, res) {
    let params = req.body
    if (!params.name) {
        res.send({ code: 999, msg: '账户名为空！' })
        return
    }
    if (!nameRule.test(params.name)) {
        res.send({ code: 999, msg: '昵称只能中英文和数字！' })
        return
    }
    if (!params.pwd) {
        res.send({ code: 999, msg: '密码为空！' })
        return
    }
    if (!pwdRule.test(params.pwd)) {
        res.send({ code: 999, msg: '密码只能是英文和数字！' })
        return
    }
    userDB.find({ name: params.name }).then(docs => {
        if (docs.find(x => x.name == params.name)) {
            res.send({ code: 999, msg: '用户名重复！' })
        } else {
            userDB.insert(params).then(() => {
                res.send({ code: 1, msg: '注册成功！' })
            }).catch(err => { })
        }
    }).catch(err => { })
});
app.post('/login', function (req, res) {
    let params = req.body
    if (!params.name) {
        res.send({ code: 999, msg: '账户名为空！' })
        return
    }
    if (!params.pwd) {
        res.send({ code: 999, msg: '密码为空！' })
        return
    }
    userDB.find(params).then(docs => {
        if (docs[0].pwd === params.pwd) {
            res.send({ code: 1, msg: '登陆成功！', data: { id: docs[0]._id, name: docs[0].name } })
        }
    }).catch(() => {
        res.send({ code: 999, msg: '账号密码错误！' })
    })
});
app.post('/setRanking', function (req, res) {
    let params = req.body
    if (!params.id) {
        res.send({ code: 999, msg: '获取用户信息失败！' })
        return
    }
    scoreDB.findOne({ id: params.id }).then((docs) => {
        if (docs) {
            if (docs.maxScore >= params.currentScore) {
                scoreDB.update({ id: params.id }, { $set: { currentScore: params.currentScore } }).then(() => {
                    res.send({ code: 1, msg: '分数重置成功！' })
                })
            } else {
                scoreDB.update({ id: params.id }, { $set: { currentScore: params.currentScore, maxScore: params.currentScore, date: params.date, maxCombo: params.maxCombo } }).then(() => {
                    res.send({ code: 1, msg: '分数重置成功！' })
                })
            }
        } else {
            params.maxScore = params.currentScore
            scoreDB.insert(params).then(() => {
                res.send({ code: 1, msg: '添加成功！' })
            })
        }
    })
});
app.post('/getRanking', function (req, res) {
    if (req.body.id) {
        let id = req.body.id
        scoreDB.findOne({ id: id }).then((docs) => {
            res.send({ code: 1, data: docs })
        }).catch(err => { })
    } else {
        scoreDB.find().then((docs) => {
            res.send({ code: 1, data: docs })
        }).catch(err => { })
    }
});
app.listen(3000);
