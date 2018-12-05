//全局保存page页码
var _page=0;
//全局保存当前的列表数据
var data;
var open_id ;
$(document).ready(function(){

    // alert(location.href);
    console.log(location.href.split("?")[1].replace("open_id=", ""));
    //如果href里面没有open_id这个字段，代表不是从发布页来的
    if(location.href.indexOf("open_id")==-1){
        open_id = $("#open_id").data("id")
    }else {
        open_id = location.href.split("?")[1].replace("open_id=","");
    }

    //首先执行以下加载函数，page=1，第一页数据
    onPullDown();
//     //--------------上拉加载更多---------------//获取滚动条当前的位置
    function getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    //获取当前可视范围的高度
    function getClientHeight() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        } else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }

    //获取文档完整的高度
    function getScrollHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    //滚动事件触发
    window.onscroll = function () {
        if (getScrollTop() + getClientHeight() === getScrollHeight()) {
            console.log('在这里加载数据咯！');
            _page++;
            onPullDown();
        }
    };
//下拉刷新
    function  onPullDown(){
        $.ajax({
            type: "GET",
//         url: "https://test.globalmxb.com/api/v1/task/publishLists",
            url: "http://h5.globalmxb.com/wechat/task/lists?open_id="+open_id+"&page="+_page,
            dataType: "json",
            success: function (res) {
                console.log(res);
                data = res;
                var html =template('taskList',data);
                if(_page==0){       //第一次刷新
                    document.getElementById('lists').innerHTML = html;
                    console.log("第一次刷新");
                }else{
                    $("#lists").append(html);
                    console.log("不是第一次刷新");
                }
            },
            err:function(err){
                console.log(err);
            }
        });
    }
//     console.log(data.data);
//     console.log("时间戳");
//     console.log(data.data[1].created);
//     var date = new Date(data.data[1].created);
//     Y = date.getFullYear() + '-';
//     M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
//     D = date.getDate() + ' ';
//     h = date.getHours() + ':';
//     m = date.getMinutes() + ':';
//     s = date.getSeconds();
//     console.log(Y + M + D + h + m + s);

//*************
    template.defaults.imports.dateFormat =  function (date, format) {

        if (typeof date === "string") {
            var mts = date.match(/(\/Date\((\d+)\)\/)/);
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2]);
            }
        }
        date = new Date(date);
        if (!date || date.toUTCString() == "Invalid Date") {
            return "";
        }
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function(all, t){
            var v = map[t];
            if(v !== undefined){
                if(all.length > 1){
                    v = '0' + v;
                    v = v.substr(v.length-2);
                }
                return v;
            }
            else if(t === 'y'){
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    };
//*****************
//     console.log(data.data[1]);

//    注册点击 事件,跳转到发布界面
    $(".ballon").click(function(){
        window.location.href="/gzh/sendTask?open_id="+open_id;
        console.log(open_id);
//         $(window).attr('location','//www.baidu.com');
//         window.location.href="跳转的地址";
    });

//     点赞事件

    $("#lists").on("click",".left",function () {
        var number =$(this).children()[1].innerHTML;
        var $number= $($(this).children()[1])
        console.log(number);
        var isThumb =$($(this).children()[1]).data("value");
        var id =$($(this).children()[1]).data("id");
        console.log(isThumb)
        // 如果有点赞,将点赞数目减少
        if(isThumb){
            $number.html(number-1);
            $($(this).children()[1]).data("value",false);
            $($(this).children()[0]).removeClass("zanRed");
            $($(this).children()[0]).addClass("zan");

        }else{
            $number.html(++number);
            $($(this).children()[1]).data("value",true);
            $($(this).children()[0]).removeClass("zan");
            $($(this).children()[0]).addClass("zanRed");
        }
        $.ajax({
            url:"http://h5.globalmxb.com/wechat/task/dianzan?open_id="+open_id+"&title_id="+id,
            type:"GET",
            success:function (res) {
                console.log(res);
            }
        })
    })


    //多行文本变为省略号
        //获取文本的行高，并获取文本的高度，假设我们规定的行数是五行，那么对超过行数的部分进行限制高度，并加上省略号
    // $('.pone').each(function(i, obj){
    //     var lineHeight = parseInt($(this).css("line-height"));
    //     var height = parseInt($(this).height());
    //     if((height / lineHeight) >1 ){
    //             $(this).addClass("p-after")
    //             $(this).css("height","85px");
    //     }else{
    //             $(this).removeClass("p-after");
    //     }
    // });
    //
    // $('.ptwo').each(function(i, obj){
    //     var lineHeight = parseInt($(this).css("line-height"));
    //     var height = parseInt($(this).height());
    //     if((height / lineHeight) >2 ){
    //         $(this).addClass("p-after")
    //         $(this).css("height","85px");
    //     }else{
    //         $(this).removeClass("p-after");
    //     }
    // });
    //
    $("#lists").on("click",".lookOver",function () {
        // console.log(this);
        var taskid = $($(this).children()[0]).data("taskid");
        window.location.href="/gzh/describe?task_id="+taskid+"&open_id="+open_id;
    })
});

