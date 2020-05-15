/**
 * success响应构造器
 * @param message 响应消息
 * @param data 响应数据
 */
function success(message, data) {
	throw new global.errs.Success(message, data)
}

/**
 * error响应构造器
 * @param message 响应消息
 * @param data 响应数据
 */
function error(message, data) {
	throw new global.errs.HttpException(message, data)
}

module.exports = {
	success,
	error,
}