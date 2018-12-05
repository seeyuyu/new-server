
var userAgentInfo = navigator.userAgent;
/*判断ios的浏览器是否是Safari*/
function getBrowser() {
    window.location.href = "itms-services://?action=download-manifest&url=https://www.hqz.com/mainfest.plist";
    // var isSafari = userAgentInfo.indexOf("Safari") != -1 && userAgentInfo.indexOf("Version") != -1;
    // if (isSafari) {
    //     window.location.href = "itms-services://?action=download-manifest&url=https://www.hqz.com/mainfest.plist";
    // } else {
    //     alert('请用Safari浏览器打开');
    // }
}
/*判断是否是微信里打开*/
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        alert('右上角点击选择浏览器打开再下载');
    }
    //return false;
    window.location.href = 'https://www.hqz.com/hqz.apk';
}
/*判断是否是ios*/
function is_system() {
    var isiOS = !!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        getBrowser();
    } else {
        is_weixn();
    }
}