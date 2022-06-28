// 导入express包
const express = require('express')
// 导入数据规则对象
const { add_article_schema } = require('../schema/articles')
// 导入数据校验中间件
const expressJoi = require('@escook/express-joi')

// 创建文章管理路由对象
const router = express.Router()
// 导入发布文章路由处理函数
const articleHandler = require('../router_handler/articles')

// 导入处理formdata格式的模块
const multer = require('multer')
// 导入路径处理模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
// 先使用multer解析数据，在使用数据校验
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), articleHandler.addArticle)

// 获取文章列表数据
router.get('/list', articleHandler.getArticleList)

// 向外共享路由
module.exports = router