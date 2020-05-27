module.exports = {
  // 项目环境：dev|prod
  environment: 'dev',

  // 数据库配置
  database: {
    dbName: 'island',
    host: '120.27.247.78',
    port: '3306',
    user: 'root',
    password: '123456',
  },
  security: {
		secretKey: 'abcdefg',        // 秘钥
		expiresIn: 60 * 60 * 24 * 30,   // 令牌过期时间 一个月
	}
}