const Router = require('koa-router')
const router = new Router({prefix: '/v1/classic'})
const request = require('../../../test')

const { PositiveIntegerValidator } = require('../../validators/validator')

router.post('/test/:id/latest',async (ctx, next) => {
  
  let header = {
    "X-Judge-Server-Token": "9c53f96fd584d25e2f61787076590f299c082fba8a4157fb190ba0dc8cca5759",
    "Content-Type": "application/json"
  }
  
  let form = {
    "src": "#include<stdio.h>\n" 
    + "int main() { \n"
    + "int a,b; \n"
    + "scanf(\"%d%d\", &a,&b);\n"
    + "printf(\"%d\\n\", a-b);\n"
    + "return 0;}",
    "language_config": {
      "compile": {
        "src_name": "main.c",
        "exe_name": "main",
        "max_cpu_time": 3000,
        "max_real_time": 5000,
        "max_memory": 134217728,
        "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c99 {src_path} -lm -o {exe_path}"
      },
      "run": {
        "command": "{exe_path}",
        "seccomp_rule": "c_cpp",
        "env": ["LANG=en_US.UTF-8", "LANGUAGE=en_US:en", "LC_ALL=en_US.UTF-8"]
      }
    },
    "max_cpu_time": 3000,
    "max_memory": 134217728,
    "test_case_id": "normal",
    "output": "false"
  }
  console.log(form.src)
  let res = await request.POST("http://120.27.247.78:8001/judge", form, header)

  ctx.body = {
    res
  }
})

module.exports = router
