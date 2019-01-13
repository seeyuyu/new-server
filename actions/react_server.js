const Employee = require("../models/employee.js");
module.exports=function ($) {
    //分类标签
    // $.get("/test/categoryLabel",async (ctx,next) => {
    //
    //     let self =ctx;
    //     self.body=categoryLabel;
    // });
    //
    $.get("/api/doLogin", async (ctx,next) => {
        console.log("-------------------------------------------");
        console.log(ctx === this.ctx);
        console.log(ctx.header)
        console.log("--------------------------------------------");
        // let result ={text:'error'}
        // self.status = 200;
        // self.body = result
        await next();
    });
    const crypto = require('crypto-js'),
        jwt = require('jsonwebtoken');

    $.post("/api/login",async (ctx,next) => {
        console.log("进来了logon函数")
        let self = ctx;
        const data = ctx.request.fields;
        console.log(self.request.header)
        console.log(ctx.request.fields);
        console.log("****************")

        if(!data.username || !data.password){
            return ctx.sendError('000002', '参数不合法');
        }
        let employeeModel = self.model('employee');
        let employee_row = await employeeModel.getRows({user_name:data.username})
        employee_row = employee_row[0]
        console.log("---------查找的东西 ");
        console.log("employee_row is ****** ");
        // console.log(employee_row);
        const result =null
        // const result = await userModel.findOne({
        //     name: data.name,
        //     password: crypto.createHash('md5').update(data.password).digest('hex')
        // })
        //如果我们找到了东西，
        console.log(employee_row.user_password === data.password)
        // console.log(employee_row[0].user_password);
        // console.log(data.password);
        if(employee_row !== null && employee_row.user_password === data.password){
            console.log("进来了返回token的函数")

            const token = jwt.sign({
                name: employee_row.name,
                _id: employee_row._id
            }, 'my_token', { expiresIn: 60*60 });
            self.body={
                data:{token},
                code:200,
                msg:"success-_-"
            }
            // (token, '登录成功');
            console.log('token is-->',token);
            console.log("-*--*-*-*-*-*-*-*-*-*-*-*-*-*");
            console.log('employee_row._id is ==>',employee_row._id)
        }else{
            self.body={
                msg:'用户名或密码错误',
            };
        }
    });
    $.post("/api/register",async (ctx,next) => {
        let self =this;
        console.log("register函数进来了");
        const data = ctx.request.fields;
        console.log(self.request.header)
        console.log(ctx.request.fields);
        console.log("****************")

        if(!data.username || !data.password){
            return ctx.sendError('000002', '参数不合法');
        }
        let employeeModel = self.model('employee');
        let employee_row = await employeeModel.getRows({user_name:data.username})
        employee_row = employee_row[0]
        console.log("---------查找的东西 ");
        console.log("employee_row is ****** ");
        console.log(employee_row);
        const result =null
        // const result = await userModel.findOne({
        //     name: data.name,
        //     password: crypto.createHash('md5').update(data.password).digest('hex')
        // })
        //如果我们找到了东西，
        // console.log(employee_row.user_password === data.password)
        // console.log(employee_row[0].user_password);
        // console.log(data.password);
        // if(employee_row !== null && employee_row.user_password === data.password){
        //     console.log("进来了返回token的函数")
        //
        //     const token = jwt.sign({
        //         name: employee_row.name,
        //         _id: employee_row._id
        //     }, 'my_token', { expiresIn: 60*60 });
        //     self.body={
        //         data:{token},
        //         code:200,
        //         msg:"success-_-"
        //     }
        //     // (token, '登录成功');
        //     console.log('token is-->',token);
        //     console.log("-*--*-*-*-*-*-*-*-*-*-*-*-*-*");
        //     console.log('employee_row._id is ==>',employee_row._id)
        // }else{
        //     self.body={
        //         msg:'用户名或密码错误',
        //     };
        // }

    })
}