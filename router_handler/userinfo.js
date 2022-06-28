// 导入数据库连接对象
const { resolveSoa } = require('dns')
const db = require('../db/index')
// 导入加密模块
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => {
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`
    // 执行sql语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 查询到的数据条数不等于1
        if (results.length !== 1) {
            return res.cc('获取用户信息失败')
        }

        // 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

// 修改用户信息
exports.updateUserInfo = (req, res) => {
    // 验证表单数据
    // 定义SQL语句
    const sql = 'update ev_users set ? where id=?'
    // 执行语句
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 执行语句成功但是影响行数不为1
        if (results.affectedRows !== 1) {
            return res.cc('该用户不存在，修改失败')
        }
        // 修改用户信息成功
        return res.cc('用户信息修改成功', 0)
    })
}

// 重置密码
exports.updatePassword = (req, res) => {
    // 根据id查询数据是否存在
    const sql = 'select * from ev_users where id=?'
    // 执行SQL语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 执行语句成功但是，查询到数据条数不等于1
        if (results.length !== 1) {
            return res.cc('用户不存在')
        }
        // 用户存在
        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        // 输入的原密码错误
        if (!compareResult) {
            res.cc('原密码错误！')
        }
        // 定义更新到数据库新密码的SQL语句
        const sql = 'update ev_users set password=? where id=?'
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行SQL语句, 根据id修改密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 执行语句失败
            if (err) return res.cc(err)
            // 执行语句成功，但是影响数据条数不等于1
            if (results.affectedRows !== 1) return res.cc('该用户不存在，密码更新失败')

            // 密码更新成功
            res.cc('密码更新成功', 0)
        })
    })
}

// 更新头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义SQL语句
    const sql = 'update ev_users set user_pic=? where id=?'
    // 执行SQL语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行语句失败
        if (err) return res.cc(err)
        // 执行语句成功，但是影响数据条数不等于1
        if (results.affectedRows !== 1) {
            return res.cc('头像更新失败')
        }
        // 头像更新成功
        res.cc('头像更新成功', 0)
    })
}