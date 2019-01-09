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
    $.get("/api/doLogin",Employee.login);
}