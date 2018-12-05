
module.exports = function() {
    return async function(ctx, next) {
        let self=ctx;
        let _params = ctx.request.query?ctx.request.query:ctx.request.fields;
        if(!_params||typeof (_params)==='undefined'){

        }else {
            let token_id = _params.token_id;
            let user_id = _params.user_id;
            if(user_id&&user_id.length>24){
                let  result = {
                    code: 201,
                    msg: 'user_id不正确 ,正确的user_id 24位',
                    data: {}
                }
                ctx.body = result
                return
            }
            if(_params&&token_id){
                console.log(_params);
                let userModel = self.model("user");
                let user = await userModel.getRow({
                    'token_id': token_id
                });
                if(!user){
                    let  result = {
                        code: 204,
                        msg: 'token_id不正确',
                        data: {}
                    }
                    ctx.body = result
                    return
                }
            }
        }
        await next()
    }
}
