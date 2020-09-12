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
  let result = 0
  let msg = ''
  res.data.some(item => {
    console.log(item)
    if (item.result !== Result.SUCCESS) {
      switch(item.result) {
        case Result.WRONG_ANSWER:
          result = Result.WRONG_ANSWER
          msg = 'Oops,Wrong answer at testcase ' + item.test_case
          break
        case Result.CPU_TIME_LIMIT_EXCEEDED:
          result = Result.CPU_TIME_LIMIT_EXCEEDED
          msg = 'Oops,CPU time limit exceeded at testcase ' + item.test_case
          break
        case Result.REAL_TIME_LIMIT_EXCEEDED:
          result = Result.REAL_TIME_LIMIT_EXCEEDED
          msg = 'Oops,Real time exceeded at testcase ' + item.test_case
          break
        case Result.MEMORY_LIMIT_EXCEEDED:
          result = Result.MEMORY_LIMIT_EXCEEDED
          msg = 'Oops,Memory limit exceeded at testcase ' + item.test_case
          break
        case Result.RUNTIME_ERROR:
          result = Result.RUNTIME_ERROR
          msg = 'Sorry,System has been broke down!'
          break
        default:
          break
      }
      return true
    }
  })


  res.code = 200
  res.result = result
  res.msg = msg
  ctx.body = {
    res
  }
})

module.exports = router
