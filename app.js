// 导入express包
const express = require('express')

// 创建express的服务器实例
const app = express()
const joi = require('joi')
//配置cors跨域
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 响应数据的中间件
app.use(function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
// 配置解析token中间件
// 导入配置文件
const config = require('./config')
// 导入token字符串解析模块
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入注册路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入文章路由模块并使用
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载上统一的前缀/my/article
app.use('/my/article', artCateRouter)

// 导入文章管理路由模块并使用
const articleRouter = require('./router/articles')
const multer = require('multer')
app.use('/my/article', articleRouter)

// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 捕获formdata数据解析的错误
    if (err instanceof multer.MulterError) return res.cc(err)
    // 未知错误
    res.cc(err)
})

// 调用listen方法指定端口号并启动web服务
app.listen(80, () => {
    console.log('server running at http://127.0.0.1');
})
