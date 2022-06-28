// 导入处理路径的核心模块
const path = require('path')
// 导入数据库操作对象
const db = require('../db/index')

// 发布新文章路由处理函数
exports.addArticle = (req, res) => {
    console.log(req.body) // 文本类型的数据
    console.log('--------分割线----------')
    console.log(req.file) // 文件类型的数据
    // 手动判断是否上传了封面
    // 没选选择文件或者文件上传的时候文件名字不是cover_img就返回
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('没有选择文章封面或者上传参数名字不是cover_img')
    // 表单数据合法
    // 整理要发布的数据对象
    const dataInfo = {
        ...req.body,
        cover_img: path.join('/upload', req.file.filename),
        pub_data: new Date().toLocaleString(),
        author_id: req.user.id
    }
    // 定义SQL语句
    const sql = 'insert into ev_articles set ?'
    // // 执行SQL语句
    db.query(sql, dataInfo, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 插入数据条数影响行数为0
        if (results.affectedRows !== 1) return res.cc('发布文章失败')
        res.cc('发布文章成功')
    })
}

// 获取文章列表路由处理函数
exports.getArticleList = (req, res) => {
    // 定义SQL语句
    const sql = 'select * from ev_articles where cate_id=? and state=?'
    // 执行sql语句
    db.query(sql, [req.query.cate_id, req.query.state], (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 查询到的数据条数小于等于0
        if (results.length <= 0) return res.cc('文章为空')
        // 如果要显示的页码超过了数组的长度
        const index = req.query.pagesize + 1
        const pageNum = req.query.pagenum
        if (results.length < pageNum) return res.cc('页码长度超过了数据长度')
        // 对查询到的数据进行处理
        const data = results.slice(0, pageNum)
        res.send({
            status: 0,
            message: '获取文章列表成功',
            data: data
        })
    })
}