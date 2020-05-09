const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class UserExercise extends Model {

}

UserExercise.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  user_id: Sequelize.INTEGER,
  // 题目id
  exercise_id: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'user_exercise'
})

module.exports = { UserExercise }