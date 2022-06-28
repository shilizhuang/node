/* 
    这里定义路由处理函数,由router/user.js调用
*/
// 抽离路由模块中的处理函数
// 注册用户的处理函数
// 导入数据库操作模块
const db = require('../db/index')
// 导入加密模块
const bcrypt = require('bcryptjs')
// 导入jwt模块
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')
exports.regUser = (req, res) => {
    const userinfo = req.body
    // 对用户数据进行合法性校验
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或密码不能为空'
    //     // })
    //     return res.cc('用户名或密码不能为空')
    // }
    // 检测用户名是否重复
    const sql = 'select * from ev_users where username=?'
    db.query(sql, [userinfo.username], (err, results) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err.message)
        }
        // 查询数组长度大于0说明用户名重复
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名重复，请更换其他用户名'
            // })
            return res.cc('用户名重复，请更换其他用户名')
        }
        // 用户名可用
        // 对用户密码进行hashSync加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 插入新用户
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            // 执行sql语句失败
            if (err) {
                // return res.send({
                //     status: 1,
                //     message: err.message
                // })
                return res.cc(err.message)
            }
            // 插入数据后影响的行数不等于1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后再试' })
                return res.cc('注册用户失败，请稍后再试')
            }
            // res.send({
            //     status: 0,
            //     message: '用户注册成功'
            // })
            res.cc('用户注册成功', 0)
        })
    })
}

// 用户登录的处理函数
exports.login = (req, res) => {
    // 校验登录数据的合法性
    // 接收表单数据
    const userinfo = req.body
    // 定义SQL语句
    const sql = 'select * from ev_users where username=?'
    // 执行sql语句
    db.query(sql, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行语句成功但是查询数组长度小于等于0
        if (results.length <= 0) {
            return res.cc('该用户不存在')
        }
        // 判断用户输入的密码是否和数据库中的一致
        const result = bcrypt.compareSync(userinfo.password, results[0].password)
        // 结果一致返回true, 否则返回false
        if (!result) {
            return res.cc('密码不正确')
        }
        // 登录成功，生成token字符串
        // 通过es6高级语法快速剔除密码和头像的值
        const user = { ...results[0], password: '', user_pic: '' }
        // 生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            // token有效期10小时
            expiresIn: '10h'
        })
        // 将生成的token字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            // 为了方便使用直接在token前面加上bearer
            token: 'Bearer ' + tokenStr
        })
    })
}