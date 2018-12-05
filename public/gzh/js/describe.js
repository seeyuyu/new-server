var open_id;
var task_id;
$(document).ready(function(){


    var _string = window.location.search.slice(1);
    _stringArray= _string.split("&");

    for(var j=0;j<_stringArray.length;j++){
        if(_stringArray[j].indexOf("task_id")!=-1){
            task_id=_stringArray[j].slice(8)
        }else if(_stringArray[j].indexOf("open_id") !=-1){
            open_id=_stringArray[j].slice(8);
        }
    }

    $.ajax({
        url:"http://h5.globalmxb.com/wechat/task/onelists?open_id="+open_id+"&_id="+task_id,
        type:"GET",
        success:function (res) {
            console.log(res);
            var html1 =template("theFirst",res.data);
            $("#des_top").html(html1);
            var html2 =template("theSecond",res)
            $("#des_dis").html(html2);

        },
        err:function (err) {
            console.log(err);
        }
    })

    var nowTime = function(){
        function p(s) {
            return s < 10 ? '0' + s: s;
        }
        var myDate = new Date();
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes();     //获取当前分钟数(0-59)
        var s=myDate.getSeconds();
        var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
//         console.log("time is");
//         console.log(now );
        return now
    }

//点击提交评论信息
    $("#sub").click(function(){
        console.log(nowTime());
        var name = $("#name").val();
        var discuss= $("#discuss").val();
        if(name && discuss){
            $.ajax({
                type: "GET",
                url: "http://h5.globalmxb.com/wechat/task/pinglun",
                data: {
                    open_id:open_id,
                    title_id:task_id,
                    // time:nowTime(),
                    name:name,
                    discuss:discuss
                },
                dataType: "json",
                success: function (response) {
                    console.log("success");
                    $("#infoAlertSuccess").fadeIn(setTimeout(function () {

                        $("#infoAlertSuccess").fadeOut()
                        window.location.reload(true);

                    },1000));
                },
                err:function(err){
                    console.log(err);
                    console.log("err");
                },complete(){
                    if(timer){
                        clearTimeout(timer)
                    }

                    $("#sub").attr({"disabled":"disabled"});
                    var timer = setTimeout(function () {
                        $("#sub").removeAttr("disabled")
                    },2000)
                }
            });
        }else{
            //显示请填写完全
            $("#infoAlert").fadeIn(setTimeout(function(){
                $("#infoAlert").fadeOut();
            },3000));
            console.log("zz");
        }
    });

    // var html =template('taskList',data);
    // document.getElementById('lists').innerHTML = html;

//查看手机号码
    $("#des_top").on("click",".find_number",function () {
        $(this).html($(this).data("number"))
        // $(this).html($(this).css("border","none") )
        $(this).css("border","none");
        $(this).css("font-size","0.16rem");
        $(this).css("color","#000");

    })

    //点赞事件
    $("#des_dis").on("click","#is_thumbs_up",function () {
        var number =$(this).children()[1].innerHTML
        var $number= $($(this).children()[1]);
        var id =$(this).data("id");
        console.log("dianzan");
        var upBol=$(this).data("value")
        //如果点赞了，我们取消
        if(upBol){
            $number.html(number-1);
            $($(this).data("value",false));
            $($(this).children()[0]).removeClass("zanRed");
            $($(this).children()[0]).addClass("zan");

        }else{
            $number.html(++number);
            $($(this).data("value",true));
            $($(this).children()[0]).removeClass("zan");
            $($(this).children()[0]).addClass("zanRed");

        }
        $.ajax({
            url:"http://h5.globalmxb.com/wechat/task/pinglundianzan?open_id="+open_id+"&discuss_id="+id,
            type:"GET",
            success:function (res) {
                console.log(res);
            }
        })
    })

});


