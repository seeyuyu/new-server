const categoryLabel= require('../../public/gzh/testjson/firstPage/categoryLabel.json');
const hotTag= require('../../public/gzh/testjson/firstPage/hotTag.json');
const firstList= require('../../public/gzh/testjson/firstPage/firstList.json');
const describeList= require('../../public/gzh/testjson/firstPage/describeList.json');

module.exports=function ($) {
    //分类标签
    $.get("/test/categoryLabel",async (ctx,next) => {

        let self =ctx;
        self.body=categoryLabel;
    });
    //多点头条
    $.get("/test/hotTag",async (ctx,next) => {
        let self =ctx;
        self.body=hotTag;
    });
    $.get("/test/taskList",async (ctx,next) => {
        let self =ctx;
        self.body=categoryLabel;

    });
    //优选列表
    $.get('/test/firstList',async(ctx,next)=>{
        let self =ctx;
        self.body=firstList;
    });
//居家助手……，接受参数
    $.get('/test/describeList',async(ctx,next)=>{
        let self =ctx;
        //0为居家助手
        if(self.request.query.type=="0"){
            self.body=describeList["居家助手"];
        }else if(self.request.query.type=="1"){
            self.body=describeList["生鲜超市"];
        }else if(self.request.query.type=="2"){
            self.body=describeList["熟食百货"];
        }else if(self.request.query.type=="3"){
            self.body=describeList["舌尖美味"];
        }else if(self.request.query.type=="4"){
            self.body=describeList["西餐红酒"];
        }
        // self.body=describeList;
    })
}