module.exports = function ($) {
    var xml2js = require('xml2js');
    let APPID = "wxdfb3c682a2b6b79b";
    let APPSECRET = "12955ccdf2cd399e9cfa78a59570bdad";

    var co = require('co');
    let OSS = require('ali-oss')
    let client = new OSS({
        region: 'oss-cn-zhangjiakou',
        accessKeyId: 'LTAI5EwTEAVSVC5a',
        accessKeySecret: 'xuR167IzhBshEGdx9AyiPecFiN02uO',
        bucket: 'mxb-pub-r'
    });
    let lastName = 'https://mxb-pub-r.oss-cn-zhangjiakou.aliyuncs.com/';

    //测试
    /*let APPID = "wx82b622f70278e89b";
    let APPSECRET = "da4e58175332328b77bed6a4134e0462";*/

    //接入微信平台
   $.get("/wechat", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;
        console.log('微信=========》',_params)

        var sha1 = require('sha1');
        var token = 'weixintr3sfs2te12411';
        var signature = _params.signature;
        var nonce = _params.nonce;
        var timestamp = _params.timestamp;
        var echostr = _params.echostr;
        var str = [token,timestamp,nonce].sort().join(''); //按字典排序，拼接字符串
        var sha = sha1(str); //加密
        // this.body = (sha === signature)? echostr + '' : 'failed'; //比较并返回结果
        let result = {
            return_code : (sha === signature)? echostr + '' : 'failed',
            layout : false
        }
        console.log("===============================")
        result.title = '版本升级提示';
        await  self.render('wx/wechat', result);
    })

    // 检验signature对请求进行校验
    function checkSignature(params){
        //token 就是自己填写的令牌
        var key=[token, params.timestamp, params.nonce].sort().join('');
        //将token （自己设置的） 、timestamp（时间戳）、nonce（随机数）三个参数进行字典排序
        var sha1 = crypto.createHash('sha1');
        //将上面三个字符串拼接成一个字符串再进行sha1加密
        sha1.update(key);

        return sha1.digest('hex') === params.signature;
        //将加密后的字符串与signature进行对比，若成功，返回echostr
    }


    //客服消息 收发消息
    $.post("/wechat", async (ctx, next) => {
        //获取ACCESS_TOKEN
        let ACCESS_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
        let options = {
            url: ACCESS_TOKEN.replace("APPID", 'wx6cdf31e03ed25790').replace("APPSECRET", 'fa0f529ba42f80de67822b701abd089b'),
            method: "GET",
            body: ""
        }
        let resultData =JSON.parse( await getData(options));
        res = resultData['access_token'];
        //console.log("res===>",res);


        //这个access_token需要自己维护
            var access_token = res;
            var body = 'success';
            console.log("微信跳转过来=>",ctx.request.body);
            var data = ctx.request.body;
            console.log("data==>",data);
        //判断数据包是否有值
        if(data == undefined){

            let self = ctx;
            let _params = self.request.fields;
            let _id = _params._id;
            let result ={};
            console.log("111111   _id==>",_id);
            //console.log("222222  resultData  _id   =======>",_id);


            ctx.redis.set('_id',_id);
            ctx.redis.expire('_id',_id);
            //console.log("333333    redis   =======>");

            if(_id!==undefined){
                result = {
                    code: 200,
                    msg: '成功',
                    data: {}
                }
                self.body = result
                return
            }
            else {
                result = {
                    code: 201,
                    msg: '失败',
                    data: {}
                }
                self.body = result
                return
            }
            self.body = result
            ctx.body = body;
        }else{

            let _id = await
                ctx.redis.get('_id',function(error, res){
                    return res;
                });
            //console.log("44444444   redis _id----------------->",_id);

            let wx_group_model = ctx.model('wx_group');
            let rows = await  wx_group_model.getRow({"_id":_id})
            //console.log("---------------------------------->",rows);

            //console.log("data++++++++=========>",data)
            //解析xml
            let result = '<xml>'+
                '<return_code><![CDATA[FAIL]]></return_code>'+
                '<return_msg><![CDATA[OK]]></return_msg>'+
                '</xml>';
            let xmlParser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true}); // xml -> json
            let row = await new Promise(async function(resovle,reject){
                xmlParser.parseString(data, async function (err, result) {
                    return resovle(result);
                });
            });
            let xml_result = row.xml;
            console.log("row=>",row)
            console.log(" 555555555 xml_result=>",xml_result)
            //console.log("6666666666666   xml_result.MsgType=>",xml_result.MsgType)


            //发消息
            switch (xml_result.MsgType){
                /*case 'text': //用户在客服会话中发送文本消息
                    console.log("进入case---------")
                    let options = {
                        url: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+access_token,
                        method: "POST",
                        body: {
                            touser:xml_result.FromUserName,
                            msgtype:"text",
                            text:{
                                content:"Hello World"
                            }
                        },
                        json: true,
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    }
                    console.log(options)
                    let aaa =await getData(options);
                    console.log('getData========>',aaa);
                    break;*/



                case 'miniprogrampage': { //用户在客服会话中发送图片消息
                    //console.log("77777777777    进入miniprogrampage---------")



                    /*//微信小程序 上传素材图片
                    var request = require('request');//http请求库
                    var fs = require('node-fs');//文件操作库
                    var formstream = require('formstream');//http发送post请求构造表单数据的库
                    let filePath = '/usr/local/mxb-nodejs/mxb/asdas1231523123.jpg'
                    fs.stat(filePath, function (err, stat) {
                        var url = 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token='+access_token+'&type=image';//uploadType就是媒体文件的类型，image,voice等
                        var form = formstream();
                        form.file('media', filePath, 'asdas1231523123.jpg', 68807);//将文档中媒体文件需要的filename，filelength参数加到要上传的表单，content-type不知道为啥没有，可能自带吧
                        var upload = request.post(url, {headers: form.headers()}, function (err, httpResponse, body) {
                            if (err) {
                                return console.error('上传失败:', err);
                            }
                            console.log('上传成功！服务器相应结果:', body);
                        });
                        form.pipe(upload);
                    });*/




                    //本地图片上传到阿里云服务器
                    let filePath = '/usr/local/mxb-nodejs/mxb/20181019142156.jpg'
                    let fileName = '20181019142156.jpg';
                    let path = await   put(client,filePath,fileName);

                    //返回图文信息
                    let options = {
                        url: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+access_token,
                        method: "POST",
                        body: {
                            touser:xml_result.FromUserName,
                            msgtype:"link",
                            link:{
                                title:"点击加入，畅快聊天",
                                description:rows.group_name,
                                url: "http://h5.globalmxb.com/h5/fenxiang?group_name="+rows.group_name+"&group_avatar="+rows.group_avatar,
                                thumb_url: path.url
                                /*pagepath:"http://h5.globalmxb.com/h5/fenxiang?group_name="+rows.group_name+"&group_avatar="+rows.group_avatar,
                                thumb_media_id:"keONaRRQHXHnZkCBy7bbnBpEGmkFSIqg5u7wMPc_Qs6X9nKU5o6jGuacITdsOhTI"*/
                            }
                        },
                        json: true,
                        /*headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        }*/
                    }
                    //console.log("88888888888",options)
                    let aaa =await getData(options);
                    //console.log('99999999999999   getData========>',aaa);
                    break;
                }
            }
            ctx.body = body;
        }
        console.log('end');

    })


    //获取微信配置
    $.get("/getWxconfig", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;
        var sha1 = require('sha1');
        let url = _params.url;

        console.log('----------------------',url)
        //获取accessToken
       /* let res = await
        ctx.redis.get('accessToken',function(error, res){
            return res;
        });
        if(res){}else{*/
            let ACCESS_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
            let options = {
                url: ACCESS_TOKEN.replace("APPID", "wxdfb3c682a2b6b79b").replace("APPSECRET", "12955ccdf2cd399e9cfa78a59570bdad"),
                method: "POST",
                body: ""
            }
            let resultData =JSON.parse( await getData(options));
           // console.log("resultData------>",resultData)
            let res = resultData['access_token'];
            //console.log("res---------->",res)
           /* ctx.redis.set('accessToken',resultData['access_token']);
            ctx.redis.expire('accessToken',resultData['expires_in']);
        }*/

        //获取jsapi_ticket
       /* let jsapi_ticket = await
        ctx.redis.get('jsapi_ticket',function(error, jsapi_ticket){
            return jsapi_ticket;
        });
        if(jsapi_ticket){}else{*/
            let get_jsapi_ticket = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi';
            let ticket_options = {
                url: get_jsapi_ticket.replace("ACCESS_TOKEN", res),
                method: "GET",
                body: ""
            }
            let ticketData =JSON.parse( await getData(ticket_options));
           // console.log("ticketData----------->",ticketData)
            let jsapi_ticket = ticketData['ticket'];
            //console.log("jsapi_ticket------>",jsapi_ticket)
          /*  ctx.redis.set('jsapi_ticket',ticketData['ticket']);
            ctx.redis.expire('jsapi_ticket',ticketData['expires_in']);
        }*/


        let noncestr = 'Wm3WZYTPz0wzccnW';
        let timestamp = Math.floor(Date.now()/1000);
        //console.log("timestamp-------->",timestamp)
        let str = 'jsapi_ticket=JSAPI_TICKET&noncestr=NONCESTR&timestamp=TIMESTAMP&url=URL';
        let string1 = str.replace('JSAPI_TICKET',jsapi_ticket).replace('NONCESTR',noncestr).replace('TIMESTAMP',timestamp).replace('URL','http://h5.globalmxb.com/gzh');
        var signature = sha1(string1); //加密
        //console.log("string1-------->",string1)
        //console.log("signature-------->",signature)
        let result = {
            'signature' : signature,
            'timestamp' : timestamp,
            'noncestr' : noncestr,
            'appid' : 'wxdfb3c682a2b6b79b'
        }
        self.body = result
        return;
    })


    $.get("/AccessToken", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;
        let AppID = _params.appid;
        let AppSecret = _params.app_secret;
        //console.log("AppID=>",AppID);
        //console.log("AppSecret=>",AppSecret);
        let ACCESS_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";

        let options = {
            url: ACCESS_TOKEN.replace("APPID", AppID).replace("APPSECRET", AppSecret),
            method: "GET",
            body: ""
        }
        //console.log(options);
    })


    //创建菜单
    $.get("/getAccessToken", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;

        let ACCESS_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";

        let options = {
            url: ACCESS_TOKEN.replace("APPID", "wxdfb3c682a2b6b79b").replace("APPSECRET", "12955ccdf2cd399e9cfa78a59570bdad"),
            method: "GET",
            body: ""
        }

        ctx.redis.exists('accessToken',async function(err, reply) {
            console.log(reply)
            if (reply === 1) {
                console.log('exists');
            } else {
                let resultData =JSON.parse( await getData(options));
                ctx.redis.set('accessToken',resultData['access_token']);
                ctx.redis.expire('accessToken',resultData['expires_in']);
            }
        });

        let params  = {
            "button": [
                {
                    "type": "view",
                    "name": "发任务",
                    "url": "http://www.soso.com/"
                },
                {
                    "type": "view",
                    "name": "任务贴",
                    "url": "http://www.soso.com/"
                },
                {
                    "name": "更多",
                    "sub_button": [
                        {
                            "type": "view",
                            "name": "搜索",
                            "url": "http://www.soso.com/"
                        },
                        {
                            "type": "click",
                            "name": "赞一下我们",
                            "key": "V1001_GOOD"
                        }
                    ]
                }
            ]
        }


            //创建菜单
            let CREATE_MENU_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
            ctx.redis.get('accessToken',async function(error, res){
                let options_menu = {
                    url: CREATE_MENU_URL.replace("ACCESS_TOKEN", res),
                    method: "POST",
                    body: JSON.stringify(params)
                }

                let menu =await getData(options_menu);
                console.log('menu========================>',menu)
            });
    })

    //获取授权
    $.get("/wechat/oauth", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;
        let urlencode = require('urlencode');

        let get_code = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";

        let url = get_code.replace("APPID", 'wxdfb3c682a2b6b79b').replace("REDIRECT_URI", urlencode('http://h5.globalmxb.com/get_user_info', 'utf-8')).replace('SCOPE','snsapi_userinfo');
        console.log('url=========>',url)
        self.body = url;
        return;
    })



    //授权回调获取用户信息
    $.get("/get_user_info", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;

        let code = _params.code;

        let get_access_token = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code';

        let options = {
            url: get_access_token.replace("APPID", 'wxdfb3c682a2b6b79b').replace("SECRET", "12955ccdf2cd399e9cfa78a59570bdad").replace('CODE',code),
            method: "GET",
            body: ""
        }


        let oauth_access_token =JSON.parse( await getData(options));
        console.log('oauth_access_token=>',oauth_access_token);

        if(oauth_access_token){
         let   openid =oauth_access_token['openid']
            await ctx.render('gzh/send-task/sendTask',{'open_id':openid});
         return
        }

    })

    $.get("/get_task_list", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;

        let code = _params.code;

        let get_access_token = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code';

        let options = {
            url: get_access_token.replace("APPID", 'wxdfb3c682a2b6b79b').replace("SECRET", "12955ccdf2cd399e9cfa78a59570bdad").replace('CODE',code),
            method: "GET",
            body: ""
        }


        let oauth_access_token =JSON.parse( await getData(options));
        console.log('oauth_access_token=>',oauth_access_token);

        if(oauth_access_token){
            let   openid =oauth_access_token['openid']
            await ctx.render('gzh/task-list/taskList',{'open_id':openid});
            return;
        }

    })


    $.get("/get_uurl", async (ctx, next) => {
        let self = ctx;
        let _params = self.request.query;

        let code = _params.code;

        let options = {
            url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdfb3c682a2b6b79b&redirect_uri=http%3a%2f%2fh5.globalmxb.com%2fget_user_info&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect",
            method: "GET",
            body: ""
        }
        //console.log('options----------mm=>',options);
      let result =    await getData(options)
      //  let oauth_access_token =JSON.parse( );
        //console.log("oauth_access_token--->",result)
       // self.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdfb3c682a2b6b79b&redirect_uri=http%3a%2f%2fh5.globalmxb.com%2fget_user_info&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect"
      //  window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdfb3c682a2b6b79b&redirect_uri=http%3a%2f%2fh5.globalmxb.com%2fget_user_info&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect"

        self.body=result

    })


    //wangxiang de jiekou
    $.get("/get_tourl", async (ctx, next) => {

        let self = ctx;
        let _params = self.request.query;
        let text = _params.text;
        let name = _params.name;
        let result = {};


        let url = "http://192.168.199.211:8000/"+name+"/"+text;
        //console.log(url);
        //console.log(url_encode(url));
        let newurl = url_encode(url);
        let options = {
            url: newurl,
            method: "GET",
            body: ""
        }
        //console.log(options)
        let oauth =JSON.parse( await getData(options));
        //console.log(oauth);
        if(oauth){
            result = {
                code: 200,
                msg: 'sucess',
                data: oauth
            }
            self.body = result
        }else{
            result = {
                code: 201,
                msg: '发布任务失败',
                data: {}
            }
            self.body = result
        }
        self.status = 200;
        self.body = result

    })

    //
    function url_encode(url){
        url = encodeURIComponent(url);
        url = url.replace(/\%3A/g, ":");
        url = url.replace(/\%2F/g, "/");
        url = url.replace(/\%3F/g, "?");
        url = url.replace(/\%3D/g, "=");
        url = url.replace(/\%26/g, "&");

        return url;
    }


    //发布任务
    $.get('/wechat/task/publish', async (ctx, next) => {
        let self = ctx;
        let result = {};
        //let _params = self.request.fields;
        let _params = self.request.query;
        let open_id = _params.open_id;
        let title = _params.title;
        let text = _params.text;
        let images = _params.images;
        let money = _params.money;
        let mobile = _params.mobile;
        let arr = images.split('+');

        let task = self.model('task_list');
        let num = await task.getRowsCount();
        let count = await task.getRowsCount({'date':{$gte:num}});
        let create_params = {
            'open_id': open_id,
            'title': title,
            'text': text,
            'images': arr !== 'undefined' ? arr : [],
            'money' : money,
            'mobile' : mobile,
            'look' : 1 ,
            'created': getDate(),
            'date' :num+count
        }
        console.log(create_params);
        //插入task表返回数据

        let task_row = await  task.createRow(create_params)
        if (task_row) {
            result = {
                code: 200,
                msg: '发布任务成功',
                data: {}
            }
        } else {
            result = {
                code: 201,
                msg: '发布任务失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result
    })

    //图片上传到服务的新地址
    $.post('/task/upload', async (ctx, next) => {
        let self = ctx;
        let result ={};
        let _params = self.request.fields;
        //console.log("_params==>",_params)
        //console.log("------------------------------->",_params.image);
        let avatar = _params.image;
        let group_avatar = '';
        //console.log("avatar.name==>",avatar[0]['name'])
        var fileName = Date.now() + Math.random().toString().substr(2, 2) + '.'+avatar[0]['name'].substring(avatar[0]['name'].indexOf('.')+1,avatar[0]['name'].length);
        let row = await put(client,avatar[0]['path'],fileName);
        if(row !== null){
            group_avatar = lastName + fileName;
            console.log("group_avatar==>",group_avatar)
        }
        if (group_avatar !==null) {
            result = {
                group_avatar
            }
            //console.log('--------------->',result)
        } else {
            result = {
                code: 201,
                msg: '申请失败',
                data: {}
            }
        }
        self.status = 200;
        self.body = result
    })

    //获取任务列表11
    $.get('/wechat/task/lists', async (ctx, next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        let open_id = _params.open_id;
        let page = _params.page;
        let params = {};

        let taskModel = self.model('task_list');
        let thumbs_up = self.model('task_list_up');


        //查询置顶任务
        let sticklist = {};
        let sticklists = [];
        if(page==0){
            let stick_row = await taskModel.getRows({'is_stick':1})

            if(stick_row){
                for(let j = 0; j < stick_row.length; j++){
                    //获取点赞数
                    let stick_upcount = await thumbs_up.getRowsCount({'title_id': stick_row[j]['_id']});
                    //是否以点赞
                    let is_stick_up = await thumbs_up.getRowsCount({'open_id': open_id,'title_id': stick_row[j]['_id']});

                    if (stick_row) {
                        sticklist = {
                            'id': stick_row[j]['_id'],
                            'open_id':open_id,
                            'title': stick_row[j]['title'],
                            'text': stick_row[j]['text'],
                            'look': stick_row[j]['look'],
                            'money':stick_row[j]['money'],
                            'created':stick_row[j]['created'],
                            'number' : stick_row[j]['date'],
                            'thumbs_upCount' :stick_upcount,
                            'is_thumbs_up': is_stick_up > 0 ? true : false
                        };
                        sticklists.push(sticklist);
                    }
                }
            }
        }

        let task_row = await taskModel.getPagedRows(params, page * 10, 10, {'date': -1});

        let publishList = {};
        let publishLists = [];
        if (task_row) {
            for (let i = 0; i < task_row.length; i++) {
                //获取点赞数
                let thumbs_upCount = await thumbs_up.getRowsCount({'title_id': task_row[i]['_id']})

                //是否以点赞
                let is_thumbs_up = await thumbs_up.getRowsCount({'open_id': open_id,'title_id': task_row[i]['_id']})
                //console.log(task_row[i]['_id'])
                //console.log(is_thumbs_up)
                if (task_row) {
                    publishList = {
                        'id': task_row[i]['_id'],
                        'open_id':open_id,
                        'title': task_row[i]['title'],
                        'text': task_row[i]['text'],
                        'look': task_row[i]['look'],
                        'money':task_row[i]['money'],
                        'created':task_row[i]['created'],
                        'number' : task_row[i]['date'],
                        'thumbs_upCount' :thumbs_upCount,
                        'is_thumbs_up': is_thumbs_up > 0 ? true : false
                    };
                    publishLists.push(publishList);
                }
                //console.log(publishLists);
            }
            if(page==0){
                result = {
                    code: 200,
                    msg: '获取悬赏任务成功',
                    stick:sticklists,
                    data: publishLists
                }
                self.status = 200;
                self.body = result
                return
            }else{
                result = {
                    code: 200,
                    msg: '获取悬赏任务成功',
                    data: publishLists
                }
                self.status = 200;
                self.body = result
                return
            }
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
    })

    //任务点赞
    $.get('/wechat/task/dianzan', async (ctx, next) => {
        let self = ctx;
        let result = {};
        //let _params = self.request.fields;
        let _params = self.request.query;
        let open_id = _params.open_id;
        let title_id = _params.title_id;

        //console.log(_params)

        let create_params = {
            'open_id': open_id,
            'title_id': title_id
        }

        //插入task表返回数据
        let task = self.model('task_list_up');
        let up_row = await task.getRow(create_params);
        console.log(up_row);
        if(up_row){
            await task.deleteRow(create_params);
        }else{
            let task_row = await  task.createRow(create_params)
            if (task_row) {
                result = {
                    code: 200,
                    msg: 'dianzan成功',
                    data: {}
                }
                self.status = 200;
                self.body = result
                return
            } else {
                result = {
                    code: 201,
                    msg: 'dianzan失败',
                    data: {}
                }
                self.body = result
                return
            }
        }
        self.status = 200;
        self.body = result
    })

    //评论点赞
    $.get('/wechat/task/pinglundianzan', async (ctx, next) => {
        let self = ctx;
        let result = {};
        //let _params = self.request.fields;
        let _params = self.request.query;
        let open_id = _params.open_id;
        let discuss_id = _params.discuss_id;

        console.log(_params)

        let create_params = {
            'open_id': open_id,
            'discuss_id': discuss_id,
            'created':getDate()
        }
        console.log(create_params)
        //插入task表返回数据
        let task = self.model('task_discuss_up');
        //是否以点赞
        let up_row = await task.getRow(_params);
        console.log(up_row)
        if(up_row){
            await task.deleteRow(_params);
            result = {
                code: 201,
                msg: 'dianzan失败',
                data: {}
            }
            self.body = result
            return
        }else{
            let task_row = await  task.createRow(create_params)
            if (task_row) {
                result = {
                    code: 200,
                    msg: 'dianzan成功',
                    data: {}
                }
                self.status = 200;
                self.body = result
                return
            } else {
                result = {
                    code: 201,
                    msg: 'dianzan失败',
                    data: {}
                }
                self.body = result
                return
            }
        }

    })

    //发表评论
    $.get('/wechat/task/pinglun', async (ctx, next) => {
        let self = ctx;
        let result = {};
        //let _params = self.request.fields;
        let _params = self.request.query;
        let open_id = _params.open_id;
        let title_id = _params.title_id;
        let name = _params.name;
        let discuss = _params.discuss;

        console.log(_params)

        let task = self.model('task_discuss');
        let count = await task.getRowsCount();
        let create_params = {
            'open_id': open_id,
            'title_id': title_id,
            'name': name,
            'discuss': discuss,
            'date' : Date.now(),
            'created':getDate()
        }
        console.log(create_params);

        //插入task表返回数据

        let task_row = await  task.createRow(create_params)
        if (task_row) {
            result = {
                code: 200,
                msg: 'pinglun成功',
                data: {}
            }
            self.status = 200;
            self.body = result
            return
        } else {
            result = {
                code: 201,
                msg: 'pinglun失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result
    })

    //查看详情
    $.get('/wechat/task/onelists', async (ctx, next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        let open_id = _params.open_id;
        let _id = _params._id;
        let params ={
            '_id':_id
        }
        let taskModel = self.model('task_list');
        let task_row = await taskModel.getRow(params);
        let list ={};
        let images = [];
        if(task_row.images == ""){
            images =[];
        }else{
            images =task_row.images
        }
        list={
            'open_id' : task_row.open_id,
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
        //console.log(task_row.mobile);
        //console.log(task_row);
        //console.log(task_row['look']);
        await taskModel.updateRow({'_id':_id},{'look':task_row['look']+1})

        let discuss_list = self.model('task_discuss');
        let discuss_row = await discuss_list.getRows({'title_id':_id},{'date':-1});
        //console.log('discuss_row------>',discuss_row);


        let publishList = {};
        let publishLists = [];
        if (discuss_row) {
            for (let i = 0; i < discuss_row.length; i++) {
                //获取点赞数
                let discuss_up = self.model('task_discuss_up');
                let discuss_upCount = await discuss_up.getRowsCount({'discuss_id': discuss_row[i]['_id']})

                //是否以点赞
                let is_thumbs_up = await discuss_up.getRowsCount({'open_id': open_id, 'discuss_id': discuss_row[i]['_id']})


                if (discuss_row) {
                    publishList = {
                        'id': discuss_row[i]['_id'],
                        'name': discuss_row[i]['name'],
                        'discuss': discuss_row[i]['discuss'],
                        'discuss_upCount': discuss_upCount,
                        'created':discuss_row[i]['created'],
                        'is_thumbs_up': is_thumbs_up > 0 ? true : false
                    };
                    publishLists.push(publishList);
                }
            }
            result = {
                code: 200,
                msg: '获取任务成功',
                data: list,
                publishLists:publishLists
            }
            self.status = 200;
            self.body = result
            return
        } else {
            result = {
                code: 201,
                msg: '获取任务失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result
    })


    // 获取任务列表
    $.get('/wechat/task/publishLists', async (ctx, next) => {
        let self = ctx;
        let func = self.library('func');
        let result = {};
        let _params = self.request.query;
        let user_id = _params.user_id;
        let min_money = _params.min_money;
        let max_money = _params.max_money;
        let limit = 10;
        let min_time = _params.min_time;
        let max_time = _params.max_time;


        let query = {
            top: 0,
            $or: [{state_complete: 2}, {state_complete: 3}],
            wechat : 1
        };

        if (typeof (min_time) !== 'undefined') {
            query['created'] = {"$gt": min_time}
        }

        if (typeof (max_time) !== 'undefined') {
            query['created'] = {"$lt": max_time}
        }

        console.log('查询条件：' + query);
        //查询任务
        let taskModel = self.model('task');
        let task_row = await taskModel.getPagedRows(query, (max_time) !== 'undefined' ? '' : (min_time) !== 'undefined' ? '' : 0, limit, {'created': -1});
        console.log("任务： " + JSON.stringify(task_row))
        let publishList = {};
        let publishLists = [];
        if (task_row) {
            for (let i = 0; i < task_row.length; i++) {
                let user = self.model('user');
                let user_row = await user.getRow({'_id': task_row[i]['user_id']});
                let task_type = self.model('task_type');
                let task_type_row = await  task_type.getRow({'task_type_code': task_row[i]['task_type']});

                //获取点赞数
                let thumbs_up = self.model('thumbs_up');
                let thumbs_upCount = await thumbs_up.getRowsCount({'alumnus_id': task_row[i]['_id'],'comment_id':''})

                //是否以点赞
                let is_thumbs_up = await thumbs_up.getRowsCount({'user_id': user_id, 'alumnus_id': task_row[i]['_id']})

                if (user_row && task_row) {
                    publishList = {
                        'nickname': user_row['nickname'],
                        'avatar': user_row['avatar'],
                        'user_id': user_row['_id'],
                        'rank': user_row['rank'],
                        'is_vip': user_row['is_vip'],
                        'id': task_row[i]['_id'],
                        'images': task_row[i]['images'],
                        'publish_school': task_row[i]['publish_school'],
                        'task_spend': task_row[i]['task_spend'],
                        'task_address': task_row[i]['task_address'],
                        'task_type': task_row[i]['task_type'],
                        'task_type_name': task_type_row['task_type_name'],
                        'task_type_child': task_row[i]['task_type_child'],
                        'title': task_row[i]['title'],
                        'text': task_row[i]['text'],
                        'end_time': task_row[i]['end_time'],
                        'created': task_row[i]['created'],
                        'is_thumbs_up': is_thumbs_up > 0 ? 1 : 0,
                        'thumbs_upCount': thumbs_upCount,
                    };
                    publishLists.push(publishList);
                }
            }
            result = {
                code: 200,
                msg: '获取悬赏任务成功',
                data: publishLists
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
    })

    // 获取悬赏任务详情
    $.get('/wechat/task/detail', async (ctx, next) => {
        let self = ctx;
        let func = self.library('func');
        let result = {};
        let _params = self.request.query;
        let task_id = _params.task_id;

        //查询任务
        let taskModel = self.model('task');
        let task_row = await taskModel.getRow({'_id': task_id});

        if (task_row) {
            let user = self.model('user');
            let user_row = await user.getRow({'_id': task_row['user_id']});
            if (user_row) {
                result = {
                    code: 200,
                    msg: '获取任务详情成功',
                    data: {
                        nickname: user_row['nickname'],
                        avatar: user_row['avatar'],
                        user_id: user_row['_id'],
                        rank: user_row['rank'],
                        is_vip: user_row['is_vip'],
                        id: task_row['_id'],
                        created: task_row['created'],
                        task_spend: task_row['task_spend'],
                        task_address: task_row['task_address'],
                        end_time: task_row['end_time'],
                        text: task_row['text'],
                        images: task_row['images'],
                        sex: task_row['sex'],
                        state_complete: task_row['state_complete'],
                        credit_total: 100
                    }
                }
                self.status = 200;
                self.body = result
                return
            } else {
                result = {
                    code: 201,
                    msg: '获取任务详情失败,用户不存在',
                    data: {}
                }
                self.body = result
                return
            }
        } else {
            result = {
                code: 201,
                msg: '获取任务详情失败',
                data: {}
            }
            self.body = result
            return
        }

        self.status = 200;
        self.body = result
    })


    //获取sessionKey
    $.get('/wechat/task/get_sessionKey', async (ctx, next) => {
        let self = ctx;
        let result = {};
        let _params = self.request.query;
        console.log("_params--------->",_params);
        let code = _params.code;
        console.log("code=======>",code)
        let getsessionKey = "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code";
        let options = {
            url: getsessionKey.replace("APPID", 'wxb4b69eade7b0dc8a').replace("SECRET", '2b66dc4a52f5d5081915b173110bfe06').replace("JSCODE",code),
            method: "GET",
            body: ""
        }
        let resultData =JSON.parse( await getData(options));
        // res = resultData['access_token'];
        console.log("sessionKey==>",resultData);

        if(resultData){
            result = {
                code: 200,
                msg: '成功',
                data: {
                    session_key : resultData['session_key'],
                    open_id :resultData['openid']
                }
            }
        }else{
            result = {
                code: 201,
                msg: '失败',
                data: {}
            }
        }
        self.status = 200;
        self.body = result
    })






    async function put (client,filePath,name) {
        let result = null;
        try {
            result = await client.put(name, filePath);
        } catch (e) {
            console.log(e);
        }
        return result;
    }


    function getData(options) {
        let xmlreader = require("xmlreader");
        let request = require("request");
        return new Promise((resolve, reject) => {
            request(options, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    //console.log(body);
                    return resolve(body);
                    /*xmlreader.read(body.toString("utf-8"), function (errors, response) {
                        if (null !== errors) {
                            return resolve(null);
                        }
                        //let prepay_id = response.xml.prepay_id.text();
                        return resolve(response);
                    });*/
                }
            });
        });
    }


    function getDate(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
    }

}
