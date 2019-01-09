/**
 * Created by ldy on 2019/1/9.
 */
//雇员表
var schema = require('./base/model')({
    user_id: {type: String, default: ''},       //用户ID,
    user_grade :{type: String, default: ''},    //用户权限
    user_name :{type: String, default: ''},     //用户姓名
    user_password :{type: String, default: ''}, //用户密码
    u_data_flag :{type: String, default: ''},   //账户是否可以使用

    created: {type: String, default: ''},       //创建日期
    date: {type: Number, default:Date.now}
});

schema.index({created: 1})

module.exports = schema
