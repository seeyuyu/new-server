module.exports=function ($) {
    $.get("/gzh",async (ctx,next) => {
        //console.log("123321");
        await ctx.render('gzh/send-task/sendTask',{'open_id':'123123'});
    });
    $.get("/gzh/sendTask",async (ctx,next) => {
        //console.log("123321");
        await ctx.render('gzh/send-task/sendTask',{'open_id':'123123'});
    });
    $.get("/gzh/taskList",async (ctx,next) => {
        let open_id = ctx.open_id;
        //console.log(open_id);
        await ctx.render('gzh/task-list/taskList',{'open_id':open_id});
    });
    $.get("/gzh/describe",async (ctx,next) => {
        //.log("123321");
        await ctx.render('gzh/describe/describe',{'open_id':'123123'});
    });

    $.get("/h5/fenxiang",async (ctx,next) => {
        //.log("123321");
        let selt =ctx;
        let _parmes =ctx.request.query;
        await ctx.render('h5/leadToxiaocx/leadToxiaocx',{'name':_parmes.group_name,"avatar":_parmes.group_avatar});
    });


    $.get("/login",async (ctx,next) => {
     await ctx.render('audit/index');
    });

    //登录
    $.get('/user/login', async (ctx, next) => {
        let self = ctx;
        let result = {};
        //let _params = self.request.fields;
        let _params = self.request.query;
        let username = _params.username;
        let password = _params.password;
        let page = _params.page =='null' ? 0 :_params.page;
        if(username=='admin' && username!=='' && password=='admin' && password!==''){
            result={
                code:200,
                text:'登录成功',
                data:{}
            }
        }
        self.status = 200;
        self.body = result;
        return


    })

    //评论列表
    $.get("/task/discuss",async (ctx,next) => {
        let self = ctx;
        let _params = self.request.query;
        let result ={};
        let params ={};
        let id = _params.id;
        let page = _params.page;
        let name = _params.date;
        let discuss = _params.title;
        if(page == 1 || page == null){
            page=0;
        }else{
            page=page-1;
        }
        //console.log(id)
        if (typeof (id) !== "undefined" && id !== "") {
            params['title_id'] = id;
        }
        if (typeof (name) !== "undefined" && name !== "") {
            params['name'] = new RegExp(name, 'i');
        }
        if (typeof (discuss) !== "undefined" && discuss !== "") {
            params['discuss'] = new RegExp(discuss, 'i');
        }
        let taskModel = self.model('task_discuss');
        let task_count = await taskModel.getRowsCount(params)
        let count = Math.ceil(task_count/10);
        //console.log(count)
        let task_row = await taskModel.getPagedRows(params, page * 10, 10, {'date': -1});
        //console.log(task_row)
        if(task_row){
            //console.log(task_row)
            await ctx.render('audit/discuss',{'rows':task_row,'count':count,'title_id':id});
        }else{
            await ctx.render('audit/discuss',{'rows':task_row,'count':count,'title_id':id});
        }
    });

    //任务列表
    $.get("/audit/tasklist",async (ctx,next) => {
        let self = ctx;
        let _params = self.request.query;
        let page = _params.page;
        let title = _params.title;
        //console.log(title);
        let date = _params.date;
        //console.log(date);
        let stick = _params.stick;
        //console.log(stick);
        if(page == 1 || page == null){
            page=0;
        }else{
            page=page-1;
        }
        //判断有没有值
        let params ={};
        if (typeof (title) !== "undefined" && title !== "") {
            params['title'] = new RegExp(title, 'i');
        }
        if (typeof (date) !== "undefined" && date !== "") {
            params['date'] = date;
        }
        if (typeof (stick) !== "undefined" && stick!=="") {
            params['is_stick'] = stick;
        }
        //console.log(params);
        //console.log(page);
        let taskModel = self.model('task_list');
        let task_row = await taskModel.getPagedRows(params, page * 10, 10, {'date': -1});
        let task_count = await taskModel.getRowsCount(params)
        let count = Math.ceil(task_count/10)
        //console.log(task_row);
        await ctx.render('audit/tasklist',{'rows':task_row,'count':count});
    });

    //后台 查看详情
    $.get("/audit/taskone",async (ctx,next) => {
        let self = ctx;
        let _params = self.request.query;
        let id = _params.id;
        //console.log(id);
        let images = [];
        let taskModel = self.model('task_list');
        let task_row = await taskModel.getRow({'_id':id})
        if(task_row.images == ""){
            images =[];
        }else{
            images =task_row.images
        }
        let list ={};
        list={
            '_id' : task_row._id,
            'title': task_row.title,
            'text': task_row.text,
            'images': images ,
            'money': task_row.money,
            'mobile':task_row.mobile,
            'look' : task_row.look,
            'created': task_row.created,
            'is_stick' : task_row.is_stick,
            'number': task_row.date
        }
        await ctx.render('audit/taskone',{'row':list});
    });


    $.get("/task/list",async (ctx,next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        let open_id = _params.open_id;
        let page = _params.page;
        let params = {};

        let taskModel = self.model('task_list');
        let task_row = await taskModel.getPagedRows(params, page * 10, 10, {'creatdate': -1});
        if (task_row) {
            result = {
                code: 200,
                msg: '获取悬赏任务成功',
                data: task_row
            }
            self.status = 200;
            self.body = result
            return
        } else {
            result = {
                code: 201,
                msg: '获取悬赏任务失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result

    });


    //删除任务
    $.get("/task/list/del",async (ctx,next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        let id = _params.id;

        let taskModel = self.model('task_list');
        let task_row = await taskModel.deleteRow(
            {'_id':id}
        );
        if (task_row) {
            result = {
                code: 200,
                msg: '删除成功',
                data: {}
            }
            self.status = 200;
            self.body = result
            return
        } else {
            result = {
                code: 201,
                msg: '删除失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result

    });

    //删除评论
    $.get("/task/discuss/del",async (ctx,next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        let id = _params.id;

        let taskModel = self.model('task_discuss');
        let task_row = await taskModel.deleteRow(
            {'_id':id}
        );
        if (task_row) {
            result = {
                code: 200,
                msg: '删除成功',
                data: {}
            }
            self.status = 200;
            self.body = result
            return
        } else {
            result = {
                code: 201,
                msg: '删除失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result

    });

    //任务置顶
    $.get("/task/list/stick",async (ctx,next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        let id = _params.id;
        let stick = _params.stick;
        //console.log(_params)
        let taskModel = self.model('task_list');

        //判断 置顶还是取消置顶
        if(stick==0){
            let task_row = await taskModel.updateRow(
                {'_id':id},{'is_stick':stick}
            );
            result = {
                code: 200,
                msg: '修改成功',
                data: {}
            }
            self.body = result
            return
        }else if(stick==1){
            let count = await taskModel.getRowsCount({'is_stick':1});
            if(count>=3){
                result = {
                    code: 204,
                    msg: '置顶失败，置顶已达到上线',
                    data: {}
                }
                self.body = result
                return
            }else{
                let task_row = await taskModel.updateRow(
                    {'_id':id},{'is_stick':stick}
                );
                if (task_row) {
                    result = {
                        code: 200,
                        msg: '修改成功',
                        data: {}
                    }
                    self.body = result
                    return
                } else {
                    result = {
                        code: 201,
                        msg: '修改失败',
                        data: {}
                    }
                    self.body = result
                    return
                }
            }
        }

        self.status = 200;
        self.body = result

    });

}