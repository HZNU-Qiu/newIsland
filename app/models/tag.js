const { Sequelize, Model } = require('sequelize')
const { db } = require('../../core/db')

/**
 * 题库标签
 */
class Tag extends Model {
	/**
	 * 新增标签
	 * @param tag tag对象
	 */
	static async add(tag) {
		return await Tag.create({
			...tag
		})
	}

	/**
	 * 编辑标签
	 * @param tag tag对象
	 */
	static async modify(tag) {
		return await Tag.update({
			...tag
		}, {
			where: {
				id: tag.id
			}
		})
	}

	/**
	 * 获取标签信息 按照拥有题库数量降序
	 */
	static async show() {
		const tag = await Tag.findAll({
			order: [['library_num', 'DESC']]
		})
		return tag
	}

	/**
	 * 删除标签
	 */
	static async delete(id) {
		return await Tag.destroy({
			where: {
				id: id
			},
			force: true
		})
	}

}

Tag.init({
	// 记录Id
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	// TAG名称
	name: Sequelize.STRING(100),
	// 标签下有多少题库
	library_num: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	}
}, {
	sequelize: db,
	tablename: 'tag'
})

module.exports = { Tag }