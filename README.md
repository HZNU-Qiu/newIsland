# “旧岛” 在线考试系统

- 本项中的代码已使用ESLint规范化过，代码规范问题不必担心
- 服务端接口代码在/server/app/v1/目录下 [接口代码](https://github.com/HytonightYX/noter-v2/tree/master/server/app/api/v1)
- 数据库交互采用ORM，处理业务代码在/server/models/目录下 [业务代码](https://github.com/HytonightYX/noter-v2/tree/master/server/app/models)
- 校验器在/server/validators/目录下 [校验器代码](https://github.com/HytonightYX/noter-v2/tree/master/server/app/validators)

## 系统架构
![image.png](https://i.loli.net/2019/12/23/tUmcZPMHG7sVNwJ.png)

![@7R_VODYJ9P2PF_HB___NQC.png](https://i.loli.net/2019/12/23/4hCmX5dyPUAjuoc.png)

![__2_UPA5MH__DH70PO_071L.png](https://i.loli.net/2019/12/23/cVIAQ82Ty4mNUKJ.png)

![OPZI_1W_1KNJRHOV_D@O49T.png](https://i.loli.net/2019/12/23/tPXNOljIThSEL6z.png)

![UE3RW5T_6_8D6KOC__S@UU0.png](https://i.loli.net/2019/12/23/fgxz8I9PT42SKnJ.png)

![9_VN7DR_OX__N_IC__W583V.png](https://i.loli.net/2019/12/23/cBKatnh8pjoPYEy.png)

## 技术栈
## 服务端
- Node.js：Koa

- ORM：Sequelize

- 代码规范 / 格式化：ESLint

- 加密：bcrypt.js

- 参数校验：validator.js

- 数据模拟：Faker.js

## 其它
- 数据库：MySQL 5.7

- 服务器：Nginx 反向代理

- 进程守护：PM2

- 安全性：所有服务均由Docker部署

## 前端
- Vue 全家桶~

## 实现功能
- 用户管理
- - 用户的CRUD
- - 题库管理员账号的分配 
- 题库管理
- - 题库CRUD
- - 题库管理员的分配
- 试卷管理
- - 试卷模板的CRUD
- - 试卷组卷
- 考试管理
- - 考试的CRUD
- - 批卷改卷

## 系统
- 服务端全局异常处理
- 路由参数自定义校验 **基于validator的二次封装**
- Token 令牌认证机制
- 鉴权 **系统管理员 > 题库管理员 > 普通用户**

## 分工
- 2人前端
- 1人服务端
- 2人测试撰写文档

## 未完成功能
- 用户错题集 80% 缺少前端页面
- OnlineJudge 50% 缺少前端页面，判题核心已完成！