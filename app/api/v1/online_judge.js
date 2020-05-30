const Router = require('koa-router')
const router = new Router({prefix: '/v1/onlineJudge'})
const request = require('../../lib/http_request_helper')

const config = require('../../../config/config')
const judgeConfig = config.judge_config
const serverUrl = config.judge_server_url

router.post('/judge',async ctx => {
  console.log(ctx.request.body)
  let header = config.judge_header
  let form = {
    "src": "#include<stdio.h>\n" 
    + "int main() { \n"
    + "int a,b; \n"
    + "scanf(\"%d%d\", &a,&b);\n"
    + "printf(\"%d\\n\", a+b);\n"
    + "return 0;}",
    "language_config": judgeConfig['c'],
    "max_cpu_time": 3000,
    "max_memory": 134217728,
    "test_case_id": "normal",
    "output": "false"
  }
  // console.log(form.src)
  let res = await request.POST(serverUrl, form, header)

  ctx.body = {
    res
  }
})

module.exports = router
