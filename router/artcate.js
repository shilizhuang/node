// 导入express
const express = require('express')
// 导入数据验证处理中间件
const expressJoi = require('@escook/express-joi')
// 导入新增文章分类数据验证规则对象
const { add_cate_schema } = require('../schema/artcate')
// 导入删除文章分类数据验证规则对象
const { delete_cate_schema } = require('../schema/artcate')
// 导入更新文章类别数据校验对象
const { update_cate_schema } = require('../schema/artcate')

// 创建路由对象
const router = express.Router()

// 导入文章处理函数对象
const articleHandler = require('../router_handler/artcate')

// 获取文章分类列表数据
// 调用处理函数
router.get('/cates', articleHandler.getArticleCates)


// 新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), articleHandler.addArticleCates)


// 根据动态参数id删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), articleHandler.deleteCateById)

// 根据动态参数id获取文章分类数据
router.get('/cates/:id', expressJoi(delete_cate_schema), articleHandler.getCateById)

// 根据动态参数id更新文章类别
router.post('/updatecate', expressJoi(update_cate_schema), articleHandler.updateCateById)
// 向外共享路由
module.exports = router