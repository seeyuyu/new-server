// var userId =123123;//拿到我的userId ,用作主键
var open_id;
$(document).ready(function(){
    //注册的事件

    // if (!cookie.get('openId')){
    // //    出发页面弹框
    //     var appid='wx3656da87f2a8cbe5';
    //     var REDIRECT_URI ='www.h5.globalmxb.com/gzh/sendList';
    //     var url='https://open.weixin.qq.com/connect/oauth2/authorize?' +
    //         'appid='+appid +
    //         '&redirect_uri='+REDIRECT_URI +
    //         '&response_type=code' +
    //         '&scope=SCOPE' +
    //         '&state=STATE' +
    //         '&connect_redirect=1    ' +
    //         '#wechat_redirect'
    //     var code ='';
    //     ajax(url,null,function (resp) {
    //             alert("网页授权完毕");
    //             console.log(resp);
    //         code =resp.code;
    //     }).then(
    //         cookie.set('openId',code,365)
    //     ).catch(
    //         console.log('授权失败')
    //     )
    // }

    //测试请求我们的数据
    // $.ajax({
    //     url:"http://h5.globalmxb.com/get_uurl",
    //     type:"GET",
    //     success:function (res) {
    //         // console.log(res);
    //         // $("html").html= haha
    //     }
    // })
//        点击发布事件
    $(".bot").click(function(){
//            先来校验所有的值
//
        var name =$(".tit_1").val();
        var discuss =$(".text1").val();
        var payment =$("#payment").val();
        // number为手机号
        var number =$("#number").val();
        var numberBol= checkPhone(number);
        var $myimg=$(".myimg");
        var images =[];
        for(var  i=0;i<$myimg.length;i++){
            images.push($myimg[i].src)
        }
        console.log(images);
        //搞定openID
        if(location.href.indexOf("open_id")==-1){
            open_id = $("#openFa").data("open_id")
            console.log("1")
        }else {
            open_id = location.href.split("?")[1].replace("open_id=","");
            console.log("2")

        }
        console.log(open_id)

        //搞定openID

            var datas={
            name:name,
            discuss :discuss,
            payment:payment,
            number:number,
            // wxchat:1,
            // userId:userId,
            img:images.join("+")
        }
        // 如果有值，且手机号码无误
        if(datas.name&&datas.discuss&&
            datas.payment&&datas.number&&numberBol){
            console.log("over");
            $.ajax({

                url:"/wechat/task/publish",
                type:"GET",
                data:{
                    open_id:open_id,
                    title:datas.name,
                    text:datas.discuss,
                    money:datas.payment,
                    mobile:datas.number,
                    images:datas.img
                },
                dataType:"json",
                success:function(){
                    console.log("任务发布完成");
                    alert("任务发布完成");
                    location.href="/gzh/taskList?open_id="+
                        open_id;
                    console.log(open_id);
                },
                err:function(){
                    alert("任务发布失败");
                }
            })
            // window.location.href="/gzh/taskList";
        }else{
            //弹出一个框，告诉信息输入有误
            console.log(datas);
            console.log(numberBol);
            $("#infoAlert1").fadeIn(setTimeout(function(){
                $("#infoAlert1").fadeOut();
            },3000));
            // $("#infoAlert1").fadeIn(setTimeout(function(){
            //     $("#infoAlert1").fadeOut();
            // },3000));
            console.log("zz");
        }
    })

    //获取openid

    // $.ajax({
    //     // url:"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8d8ef56ba64a5b7f&redirect_uri=http://h5.globalmxb.com/get_user_info&response_type=code&scope=snsapi_userinfo&state=STATE",
    //     url:"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdfb3c682a2b6b79b&redirect_uri=http%3a%2f%2fh5.globalmxb.com%2fget_user_info&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect",
    //     type:"GET",
    //     success:function (res) {
    //         console.log(res);
    //         shouquan =res;
    //         console.log("第一个ajax请求完毕");
    //         // $.ajax({
    //         //     url:res,
    //         //     type:"GET",
    //         //     success:function(res){
    //         //         console.log(res);
    //         //         console.log("第er个ajax请求完毕");
    //         //
    //         //     },
    //         //     err:function (err) {
    //         //         console.log("第二个ajax出错了");
    //         //     }
    //         // });
    //
    //     },
    //     err:function (err) {
    //         console.log("第一个ajax出错了");
    //     }
    // })

//配置wx.config 文件
//
//     var userUrl ='';
//     var userId ='';//拿到我的userId ,用作主键
//     $.ajax({
//         url:"https://h5.globalmxb.com/wechat/oauth",
//         type:"GET",
//         success:function (res) {
//             userUrl=res;
//             alert("拿到了要的网址");
//             console.log(("拿到了数据"));
//         }
//
//     })
// 跳转到任务发布页面，并且携带上自己的发的链接？？？
//     var link = location.href.split('#')[0];
//     var link ="http://h5.globalmxb.com/gzh"
//     $.ajax({
//         // location.href.split('#')[0]
//         url:"http://h5.globalmxb.com/getWxconfig?url="+link,
//         type:"GET",
//         dataType:"json",
//         success:function (res) {
//             console.log(res);
//             console.log("wx.config配置上去了");
//             wx.config({
//                 debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                 appId: res.appid, // 必填，公众号的唯一标识
//                 timestamp:res.timestamp , // 必填，生成签名的时间戳
//                 nonceStr: res.noncestr, // 必填，生成签名的随机串
//                 signature: res.signature,// 必填，签名
//                 jsApiList: [
//                     'chooseImage',
//                     "uploadImage",
//                     "getLocalImgData",
//                     "downloadImage"
//                 ],
//                 // 必填，需要使用的JS接口列表
//                 success:function () {
//                     console.log(("配置成功"));
//                 },
//                 fail:function () {
//                     console.log(("配置失败"));
//                 }
//             });
//
//         },
//         err:function (err) {
//             console.log(err);
//         }
//     });

//开始做照片事件
    var photoMount =0;
    var $photoList =$(".photoList")[0];
    var $myimg_fa=$(".myimg_fa")[0];
//        照片点击事件
    $("#photos").click(function() {
        console.log(photoMount);
        photoMount++;

        if (photoMount <= 3) {
            //右移效果,每点一下临时生产一个站位，站住地址
            if($myimg_fa){
                //如果已经有这个元素了,克隆，否new
                $myimg_fa.clone(true).appendTo($photoList);
                console.log(("克隆完毕"));
            }else {
                $("<div class=\"myimg_fa fl\" >" +
                    "<img class=\"myimg\"/>" +
                    '<i class="del_icon"></i>'+
                    "<input type=\"text\" class=\"hiddenImg\" style=\"display: none\">" +
                    "</div>").appendTo($photoList);
                // console.log(("新建完毕，打印查看 myimg_fa"));
                // console.log($(".myimg_fa"));
                // console.log(("-------- myimg_fa"));
                $myimg_fa=$(".myimg_fa");
            }
            // $myimg_fa =$(".myimg_fa");

            $("#photos").css('left', (1 * photoMount + 'rem'));

            //调用找照片接口
            // takePicture(photoMount);
            if(photoMount==3){
                $("#photos").hide();
            }
        }
    });

//config 配置完成会立即执行ready函数
// wx.ready(function () {
//     // 在这里调用 API
//     wx.checkJsApi({
//         jsApiList: [
//             'chooseImage',
//             'uploadImage',
//             'getLocalImgData',
//             'downloadImage'
//         ],
//         success: function (res) {
//             console.log(JSON.stringify(res));
//         },
//         err:function (err) {
//             console.log(("wx.ready这一步出现了问题"));
//             console.log(err);
//         }
//     });
// });

    // wx.error(function(res){
    //     console.log("错误来自wx.error");
    //     console.log(res);
    // });

   /* $("#lidy").click(function () {
        // console.log(this.files)
        console.log(123)
        console.dir(this);
        var data=this.files[0]
        $.ajax({
            url:"http://h5.globalmxb.com/task/upload?image="+data,
            type:"GET",
            success:function (res) {
                console.log(res)
            }
        })
    })*/


//调取摄像头和相册
//     function takePicture(nums) {
//         wx.chooseImage({
//             count: 1,
//             needResult: 1,
//             sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//             sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//             success: function (data) {
//                 console.log("进入了chooseImage,拿到了照片，下面是data");
//                 console.log(data);
//
//                 localImageIds = data.localIds[0];   // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
//                 alert()
//                 var num1 = nums;
//                 wxuploadImage(localIds,num1);
//                 wxgetLocalImgData(localIds,num1);
//             },
//             fail: function (res) {
//                 console.log(("操作提示", JSON.stringify(res), "1", "确定", "", "", ""));;
//             }
//         });
//     }
// //上传到微信服务器的代码
//     function wxuploadImage(e,num) {
//         var $hiddenImg= $(".hiddenImg");
//         wx.uploadImage({
//             localId: e, // 需要上传的图片的本地ID，由chooseImage接口获得
//             isShowProgressTips: 1, // 默认为1，显示进度提示
//             success: function (res) {
//                 mediaId = res.serverId;
//                 wx.downloadImage(mediaId)
//                 $($hiddenImg[num]).val(mediaId);
//             },
//             fail: function (error) {
//                 picPath = '';
//                 localIds = '';
//                 alert(290+Json.stringify(error));
//             }
//         });
//     }
// //获取本地图片接口，在本地显示
//     function wxgetLocalImgData(e,num){
//         var $myimg = $(".myimg");
//         // 判断当前使用的是什么版本的ios-webview内核
//         if(window.__wxjs_is_wkwebview){
//             wx.getLocalImgData({
//                 localId: e, // 图片的localID
//                 success: function (res) {
//                     var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
//                     localData = localData.replace('jgp', 'jpeg');//iOS 系统里面得到的数据，类型为 image/jgp,因此需要替换一下
//                     $($myimg[num]).attr("src", localData);
//                 },fail:function(res){
//                     alert("显示失败");
//                 }
//             });
//         }else{
//             $($myimg[num]).attr("src", e);
//
//         }
//     }
// //提交到本地服务器，本地服务器存起来
//     function tijiao(){
//         var userType = user.userType;
//         var userName = userInfo.contacts;
//         var principalPhoneCode = userInfo.phone;
//         var img1 = $($(".hiddenImg")[0]).val();
//         var img3 = $($(".hiddenImg")[1]).val();
//         var img5 = $($(".hiddenImg")[2]).val();
//         var img6 = $($(".hiddenImg")[3]).val();
//         var img7 = $($(".hiddenImg")[4]).val();
//         $.ajax({
//             url:'h5.globalmxb.com',
//             data:{
//                 "img1":img1,
//                 "img3":img3,
//                 "img5":img5,
//                 "img6":img6,
//                 "img7":img7
//             },
//             type:'post',
//             dataType:'json',
//             async:false,
//             success:function(data){
//                 console.log("信息发布完成")
//             },
//             error:function(data){
//                 alert("信息发布失败")
//             }
//         })
//     }

//点击删除事件
    $('.photoList').on("click",".del_icon",function () {
        // console.log( $(this).parent()  ) ;
        $(this).parent().remove();
        $("#photos").show();
        photoMount--;
        $("#photos").css('left', (1 * photoMount + 'rem'));
    })

});
