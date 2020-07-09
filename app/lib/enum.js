/**
 * JS类来模拟枚举
 */

/**
 * 登录方式枚举类
 * @type {{USER_MINI_PROGRAM: number, USER_EMAIL: number, USER_MOBILE: number, ADMIN_EMAIL: number}}
 */
const LoginType = {
	USER_MINI_PROGRAM: 100, // 小程序登录
	USER_EMAIL: 101,        // 邮箱登录
	USER_ACCOUNT: 102,       // 手机号登录
	ADMIN_EMAIL: 200,       // 管理员邮箱登录
	isThisType
}

/**
 * 
 * @type {SINGLECHOICE: number, MULTIPLECHOICE: number, JUDGE: number} 
 */
const ExerciseScore = {
	SINGLECHOICE: 2, // 单选题一题2分
	MULTIPLECHOICE: 4, // 多选题一题4分
	JUDGE: 1 // 判断题一题1分
}

/**
 * 
 * @param {WRONG_ANSWER: number, SUCCESS: number, CPU_TIME_LIMIT_EXCEEDED: number, REAL_TIME_LIMIT_EXCEEDED: number, MEMORY_LIMIT_EXCEEDED: number} 
 */
const Result = {
	WRONG_ANSWER: -1,
	SUCCESS: 0,
	CPU_TIME_LIMIT_EXCEEDED: 1,
	REAL_TIME_LIMIT_EXCEEDED: 2,
	MEMORY_LIMIT_EXCEEDED: 3,
	RUNTIME_ERROR: 4,
	SYSTEM_ERROR: 5
}

/**
 * 判题服务器错误代码枚举
 */
const Server_Error = {
	NONE: 0,
	INVALID_CONFIG: -1,
	CLONE_FAILED: -2,
	PTHREAD_FAILED: -3,
	WAIT_FAILED: -4,
	ROOT_REQUIRED: -5,
	LOAD_SECCOMP_FAILED: -6,
	SETRLIMIT_FAILED: -7,
	DUP2_FAILED: -8,
	SETUID_FAILED: -9,
	EXECVE_FAILED: -10,
	SPJ_ERROR: -11
}

/**
 * 判断val是否属于该类型
 * @param val
 * @returns {boolean}
 */
function isThisType(val) {
	for (let key in this) {
		if (this[key] === val) {
			return true
		}
	}
	return false
}

module.exports = {
	LoginType,
	ExerciseScore,
	Result,
	Server_Error
}
