let ppxUntil = module.exports = {};
let AppKey = "AK14bacba9b568822809871621ba1064";
ppxUntil.get_ver_user = async function (cardNo, realName) {
    let apiUrl = 'https://v.apistore.cn/api/a1?'
    let objParam = {
        key: AppKey,
        cardNo: cardNo,
        realName: realName,
        information: 1
    }
    var qs = require('querystring');
    let content = qs.stringify(objParam);
    console.log(content);
    let options = {
        url: apiUrl + content,
        method: "GET",
    }
    let result_data = await  getData(options);
    return result_data
}

function getData(options) {
    var request = require("request");
    return new Promise((resolve, reject) => {
        request(
            options, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    console.log('http_result_body', body);
                    return resolve(body);
                } else if (!err && res.statusCode == 501) {
                    return null;
                } else {
                    return null;
                }
            });
    });
}

function md5Str(params) {
    var crypto = require('crypto');
    let encrptStr = AppSecret + sortParam(params) + AppSecret;
    console.log(encrptStr);
    //   console.log(params);
    var md5sum = crypto.createHash('md5');
    md5sum.update(encrptStr);
    encrptStr = md5sum.digest('hex');
    return encrptStr;
}

function sortParam(param) {
    if (!param) {
        return "";
    }
    // 排序键，按照字母先后进行排序
    var arr = [];
    for (var ld in param) {//list<map>
        arr.push(ld)
    }
    arr.sort();
    // 生成进行MD5摘要的字符串
    var sb = ''
    for (var key in arr) {
        sb = sb + arr[key] + param[arr[key]]
    }
    // 检查结果
    if (sb.length > 0) {
        return sb;
    } else {
        return "";
    }
}