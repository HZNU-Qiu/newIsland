const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const bcryptjs = require('bcryptjs')
const { Forbidden } = require('../../middlewares/exception')

class User extends Model {
  /**
   * 用户新增
   * @param user 新用户对象
   */
  static async add(user) {
    return await User.create({
      ...user
    })
  }

  /**
   * 用户账号密码登录
   */
  static async signIn(account, password) {
    const user = await User.findOne({
      where: { account: account, status: 1 }
    })
    // 如果用户不存在
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在,或被禁用')
    }
    const correct = bcryptjs.compareSync(password, user.password)
    if (!correct) {
      throw new global.errs.AuthFailed('账号密码错误')
    }
    return user
  }

  /**
   * 用户列表(分页) 默认一页15条记录
   * @param offset 跳过多少数据
   */
  static async listByPage(offset, type) {
    const user = await User.findAndCountAll({
      attributes: {
        exclude: ['password', 'openid']
      },
      where: {
        type: type
      },
      offset: offset,
      limit: 15
    }).then(res => {
      let result = {}
      result.list = res.rows
      result.total = res.count
      return result
    })
    return user
  }

  /**
   * 禁用普通用户账号
   * @param id 用户id
   */
  static async banUser(id) {
    if (id === 1) {
      throw new global.errs.Forbidden('您无权限禁用')
    }
    await User.update({
      status: 0
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 启用普通用户账号
   * @param id 用户id
   */
  static async activateUser(id) {
    await User.update({
      status: 1
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 编辑个人信息
   * @param info 用户信息
   */
  static async modify(info) {
    await User.update({
      ...info
    }, {
      where: {
        id: info.id
      }
    })
  }

  /**
   * 获取个人信息
   * @param id 用户id
   */
  static async detail(id) {
    return await User.findByPk(id)
  }

  /**
   * 重置用户密码
   */
  static async resetPassword(param) {
    return await User.update({
      ...param
    }, {
      where: {
        id: param.id
      }
    })
  }

}

User.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户名
  username: Sequelize.STRING(64),
  // 账户
  account: Sequelize.STRING(64),
  // 密码
  password: {
    type: Sequelize.STRING(128),
    // 观察者模式
    set(val) {
      const salt = bcryptjs.genSaltSync(10)
      const hashPassword = bcryptjs.hashSync(val, salt)
      this.setDataValue('password', hashPassword)
    }
  },
  // 用户邮箱
  email: {
    type: Sequelize.STRING(256),
    unique: true,               // 唯一
  },
  // 性别
  sex: Sequelize.INTEGER,
  // 用户头像
  avatar: Sequelize.STRING(255),
  // 第三方id
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  },
  // 角色类型
  type: Sequelize.INTEGER,
  // 账户状态
  status: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'user'
})

module.exports = { User }