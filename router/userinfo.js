// 导入express模块
const express = require('express')
// 导入用户信息处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 创建路由对象
const router = express.Router()


// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 导入数据验证合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入数据验证规则对象
const { update_userinfo_schema } = require('../schema/user')
// 更新用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 导入数据验证规则对象
const { update_password_schema } = require('../schema/user')
// 重置密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

// 导入更新头像规则对象
const { update_avatar_schema } = require('../schema/user')
// 更新头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

// 向外共享路由
module.exports = router