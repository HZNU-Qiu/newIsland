const Router = require('koa-router')
const router = new Router({ prefix: '/v1/onlineJudge' })
const request = require('../../lib/http_request_helper')
const { Result, Server_Error } = require('../../lib/enum')

const config = require('../../../config/config')
const judgeConfig = config.judge_config
const serverUrl = config.judge_server_url

router.post('/judge', async ctx => {
  // console.log(ctx.request.body.code)
  let header = config.judge_header
  let form = {
    "src": ctx.request.body.code,
    "language_config": judgeConfig['c'],
    "max_cpu_time": 3000,
    "max_memory": 134217728,
    "test_case_id": "normal",
    "output": "false"
  }
  // console.log(form.src)
  let res = await request.POST(serverUrl, form, header)
  let {result, real_time, cpu_time, error, memory} = res.data[0]
  res.code = 200
    ctx.body = {
      res
    }
})

module.exports = router
