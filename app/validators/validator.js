const { LinValidator, Rule } = require('../../core/lin-validator')
const { db } = require('../../core/db')
const { User } = require('../models/user')
const { Tag } = require('../models/tag')
const { Library } = require('../models/library')
const { Chapter } = require('../models/chapter')
const { Exercise } = require('../models/exercise')
const { Paper } = require('../models/paper')
const { Exam } = require('../models/exam')
const { UserExercise } = require('../models/user_exercise')
const { Announcement } = require('../models/announcement')

/**
 * 用户注册校验器
 */
class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.sex = [
      new Rule('isInt', '性别只有两种', { min: 1, max: 2 })
    ]
    this.password1 = [
      new Rule('isLength', '密码长度为6~18个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码至少1个大写字母，1个小写字母和一个数字', /^[\w_-]{6,16}$/)
    ]
    // 这里是相同的规则
    this.password2 = this.password1
    this.username = [
      new Rule('isLength', '用户名长度为4-16个字符', { min: 4, max: 16 })
    ]
    this.account = [
      new Rule('isLength', '账户长度为6~12个字符', { min: 6, max: 12 }),
      new Rule('matches', '必须是英文字符和数字的组合', /^[0-9a-zA-Z]+$/)
    ]
  }

  // 校验两次密码是否相同
  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该email已被注册!')
    }
  }

  async validateUsername(vals) {
    const username = vals.body.username
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该用户名已被注册!')
    }
  }

  async validateAccount(vals) {
    const account = vals.body.account
    const user = await User.findOne({
      where: {
        account: account
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该账户已被注册!')
    }
  }
}

/**
 * 账号分配校验器
 */
class AccountDesignateValidator extends LinValidator {
  constructor() {
    super()
    this.password1 = [
      new Rule('isLength', '密码长度为6~18个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码至少1个大写字母，1个小写字母和一个数字', /^[\w_-]{6,16}$/)
    ]
    // 这里是相同的规则
    this.password2 = this.password1
    this.username = [
      new Rule('isLength', '用户名长度为4-16个字符', { min: 4, max: 16 })
    ]
    this.account = [
      new Rule('isLength', '账户长度为6~12个字符', { min: 6, max: 12 }),
      new Rule('matches', '必须是英文字符和数字的组合', /^[0-9a-zA-Z]+$/)
    ]
  }

  // 校验两次密码是否相同
  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同')
    }
  }

  async validateUsername(vals) {
    const username = vals.body.username
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该用户名已被注册!')
    }
  }

  async validateAccount(vals) {
    const account = vals.body.account
    const user = await User.findOne({
      where: {
        account: account
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该账户已被注册!')
    }
  }
}

/**
 * 不能为空校验器
 */
class NotEmptyValidator extends LinValidator {
  constructor() {
    super()
    this.token = [
      new Rule('isLength', '不允许为空', {
        min: 1
      })
    ]
  }
}

/**
 * 登录参数校验器
 */
class LoginParametersValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '账号不能为空', { min: 1 })
    ]
    this.password = [
      new Rule('isLength', '密码不能为空', { min: 1 })
    ]
  }
}

/**
 * 正整数校验器
 */
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    // 如果有多个rule关系是‘且’关系
    this.id = [
      new Rule('isInt', '需要正整数', { min: 1 })
    ]
  }
}

/**
 * 用户信息校验器
 */
class UserInfoValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要正整数', { min: 1 })
    ]
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.sex = [
      new Rule('isInt', '性别只有两种', { min: 1, max: 2 })
    ]
  }
}

/**
 * 标签信息校验器
 */
class TagInfoValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '标签名不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
  }
  async validateTagName(vals) {
    const name = vals.body.name
    const tag = await Tag.findOne({
      where: {
        name: name
      }
    })
    if (tag) {
      throw new Error('该标签已有')
    }
  }
}

class TagModifyValidator extends TagInfoValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', 'Id需为正整数', { min: 1 })
    ]
  }
}

/**
 * 题库信息校验
 */
class LibraryInfoValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '题库名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.tag_id = [
      new Rule('isInt', '类型必须为整数且不能为空', { min: 1 })
    ]
  }
  async validateLibraryName(vals) {
    const name = vals.body.name
    const library = await Library.findOne({
      where: {
        name: name
      }
    })
    if (library) {
      throw new Error('该题库已有')
    }
  }
}

/**
 * 题库管理员分配校验器
 * 用于管理员变更
 */
class DesignateValidator extends LinValidator {
  constructor() {
    super()
    this.userId = [
      new Rule('isInt', '用户id必须位整数且不为空', { min: 1 })
    ]
    this.libraryId = [
      new Rule('isInt', '题库管理员id必须为整数且不为空', { min: 1 })
    ]
  }
  async validateAdmin(vals) {
    const userId = vals.body.userId
    const user = await Library.findOne({
      where: {
        admin_id: userId
      }
    })
    if (user) {
      throw new Error('该管理员已经分配过题库了')
    }
  }
}

/**
 * 给题库分配第一任管理员校验
 * 需要检测管理员是否已经分配和题库是否已经分配
 */
class AddAdminValidator extends DesignateValidator {
  constructor() {
    super()
  }
  async validateLibrary(vals) {
    const libraryId = vals.body.libraryId
    const library = await Library.findByPk(libraryId)
    if (library.admin_id) {
      throw new Error('该题库已经分配过管理员了')
    }
  }
}

/**
 * 新增题库章节校验器
 * id不为空，相同题库下的章节名称不能重复
 */
class AddChapterValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '名称不能为空且不得超过32个字符', { min: 1, max: 32 })
    ]
    this.library_id = [
      new Rule('isInt', '题库id不能为空', { min: 1 })
    ]
  }
  async validateChapterName(vals) {
    const name = vals.body.name
    const libraryId = vals.body.library_id
    const data = await Chapter.findOne({
      where: {
        library_id: libraryId,
        name: name
      }
    })
    if (data !== null) {
      throw new Error('章节名称冲突了')
    }
  }
}

/**
 * 删除题库标签校验器
 */
class DeleteTagValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateIsEmptyTag(vals) {
    const tagId = vals.path.id
    const data = await Library.findOne({
      where: {
        tag_id: tagId
      }
    })
    if (data) {
      throw new Error('该标签下有题库，不能删除')
    }
  }
}

/**
 * 新增练习题校验器
 */
class AddExerciseValidator extends LinValidator {
  constructor() {
    super()
    this.chapter = [
      new Rule('isInt', '章节号为正整数', { min: 1 })
    ]
    this.content = [
      new Rule('isLength', '长度不能为空', { min: 1 })
    ]
    this.answer = [
      new Rule('isLength', '长度不能为空', { min: 1 })
    ]
    this.type = [
      new Rule('isInt', '类型只有三种', { min: 1, max: 3 })
    ]
    this.level = [
      new Rule('isInt', '困难级别只有三种', { min: 1, max: 3 })
    ]
    this.status = [
      new Rule('isInt', '类型只有两种', { min: 1, max: 2 })
    ]
  }
  async validateContent(vals) {
    const content = vals.body.content
    const exercise = await Exercise.findOne({
      where: {
        content: content
      }
    })
    if (exercise) {
      throw new Error('此题目已存在')
    }
  }
}

/**
 * 编辑题目校验器
 */
class ModifyExerciseValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateExerciseExist(vals) {
    const id = vals.body.id
    const exercise = await Exercise.findByPk(id)
    if (!exercise) {
      throw new Error('更改题目不存在')
    }
  }
}

/**
 * 题库是否存在校验器
 */
class IsLibraryExistValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateLibraryExistence(vals) {
    let id = vals.body.id
    if (!id)
      id = vals.path.id
    const library = await Library.findByPk(id)
    if (!library)
      throw new Error('题库不存在')
  }
}

/**
 * 试卷查询参数校验器
 * currentPage, type, library_id, status
 */
class QueryPaperValidator extends LinValidator {
  constructor() {
    super()
    this.currentPage = [
      new Rule('isInt', '当前页数必须为正整数', { min: 1 })
    ]
    this.type = [
      new Rule('isInt', '试卷类型只有两种', { min: 1, max: 2 })
    ]
    this.library_id = [
      new Rule('isInt', '题库编号为正整数', { min: 1 })
    ]
    this.status = [
      new Rule('isInt', '试卷状态只有两种', { min: 1, max: 2 })
    ]
  }
  async validateLibraryExistence(vals) {
    const id = vals.body.library_id
    const library = await Library.findByPk(id)
    if (!library) {
      throw new Error('题库不存在')
    }
  }
}

class AddPaperModelValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '试卷名必须1-16个字符', { min: 1, max: 16 })
    ]
    this.library_id = [
      new Rule('isInt', '所属题库编号必须为正整数', { min: 1 })
    ]
    this.type = [
      new Rule('isInt', '试卷类型只有两种', { min: 1, max: 2 })
    ]
  }
}

/**
 * 组卷参数校验器
 */
class AssemblePaperValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '试卷名必须1-16个字符', { min: 1, max: 16 })
    ]
    this.type = [
      new Rule('isInt', '试卷类型只有两种', { min: 1, max: 2 })
    ]
    this.status = [
      new Rule('isInt', '状态只有两种', { min: 0, max: 1 })
    ]
    this.score = [
      new Rule('isInt', '分数必须在10-150分之内', { min: 10, max: 150 })
    ]
    this.problem_list = [
      new Rule('isLength', '题目列表不能为空', { min: 1 })
    ]
  }
  /**
   * 校验分数是否正确
   * @param vals 请求 
   */
  async validateScore(vals) {
    const score1 = vals.body.score
    let problemStr = vals.body.problem_list
    let score2 = 0
    let problems = await db.query(
      `SELECT type FROM exercise WHERE id in (${problemStr})`
      , { raw: true })
    problems[0].map(item => {
      switch (item.type) {
        case 1:
          score2 += 2
          break
        case 2:
          score2 += 4
          break
        case 3:
          score2 += 1
          break
        default:
          throw new Error('练习题数据库异常')
      }
    })
    if (score1 !== score2) {
      throw new Error('分值计算错误')
    }
  }
}

class ExamValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '考试名称不得为空', { min: 1 })
    ]
    this.start = [
      new Rule('isLength', '考试名称不得为空', { min: 1 })
    ]
    this.end = [
      new Rule('isLength', '考试名称不得为空', { min: 1 })
    ]
    this.paper_id = [
      new Rule('isInt', '试卷id必须为正整数', { min: 1 })
    ]
  }
  async validatePaperIsFormal(vals) {
    const paperId = vals.body.paper_id
    const paper = await Paper.findByPk(paperId)
    if (!paper) {
      throw new Error('试卷不存在')
    } else if (paper.type !== 2) {
      throw new Error('正式考试得用正式考试试卷')
    }
  }
}

/**
 * 新增考试校验器
 */
class AddExamValidator extends ExamValidator {
  constructor() {
    super()
  }
  async validateTime(vals) {
    let { start, end } = vals.body
    let startTime = new Date(start).getTime() / 1000
    let endTime = new Date(end).getTime() / 1000
    let now = new Date().getTime() / 1000
    if (startTime < now || endTime < now || startTime >= endTime) {
      throw new Error('考试开始时间和结束时间不得早于创建时间且结束时间不得早于开始时间')
    } else if (endTime - startTime > 7200) {
      throw new Error('线上考试最多两个小时')
    }
  }
}

/**
 * 编辑考试信息校验器
 */
class ModifyExamValidator extends ExamValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '编号必须为正整数', { min: 1 })
    ]
  }
  async validateModify(vals) {
    let { id, start, end } = vals.body
    const exam = await Exam.findByPk(id)
    if (!exam)
      throw new Error('考试不存在不能编辑')
    let startTime = new Date(exam.start).getTime() / 1000
    let endTime = new Date(exam.end).getTime() / 1000
    let now = new Date().getTime() / 1000
    start = new Date(start).getTime() / 1000
    end = new Date(end).getTime() / 1000
    if (exam.status > 0 && (start !== startTime || end !== endTime)) {
      throw new Error('考试已开始不得修改时间')
    } else if (exam.status === 0 && (start < now || end < now || start >= end)) {
      throw new Error('考试开始时间和结束时间不得早于创建时间且结束时间不得早于开始时间')
    }
  }
}

/**
 * 禁用题库校验器
 */
class BanLibraryValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateHasExam(vals) {
    const id = vals.path.id
    let sql = `
    SELECT COUNT(*) AS num FROM exam e
    LEFT JOIN paper p ON e.paper_id = p.id
    WHERE p.library_id = ${id}
    `
    const num = await db.query(sql,
      { raw: true }).then(obj => {
        return obj[0][0].num
      })
    if (num !== 0) {
      throw new Error('该题库有考试不能禁用')
    }
  }
}

/**
 * 题库是否可用校验器
 */
class IsLibraryAccessibleValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateLibraryAccessibilty(vals) {
    const id = vals.path.id
    const library = await Library.findOne({
      where: {
        id: id,
        status: 1
      }
    })
    if (!library) {
      throw new Error('题库不可用')
    }
  }
}

/**
 * 题库激活校验器
 */
class ActivateLibraryValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateLibraryHasAdmin(vals) {
    const id = vals.path.id
    const library = await Library.findByPk(id)
    if (!library) {
      throw new Error('题库不存在')
    } else if (library.status) {
      throw new Error('题库已经激活了')
    } else if (!library.admin_id) {
      throw new Error('题库还有没分配管理员，不能激活')
    }
  }
}

/**
 * 题目存在校验器
 */
class ExerciseExistenceValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  async validateExerciseExistence(vals) {
    const id = vals.path.id
    const exercise = await Exercise.findByPk(id)
    if (!exercise) {
      throw new Error('题目不存在')
    }
  }
}

/**
 * 题库编辑校验器
 */
class ModifyLibraryValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '题库名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.tag_id = [
      new Rule('isInt', '类型必须为整数且不能为空', { min: 1 })
    ]
  }
  async validateNameRepeat(vals) {
    const id = vals.body.id
    const name = vals.body.name
    const library = await Library.findOne({
      where: {
        name: name
      }
    })
    if (library && library.id !== id) {
      throw new Error('名称冲突不能修改')
    }
  }
}

/**
 * 修改密码校验
 */
class ResetPasswordValidator extends LinValidator {
  constructor() {
    super()
    this.password1 = [
      new Rule('isLength', '密码长度为6~18个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码至少1个大写字母，1个小写字母和一个数字', /^[\w_-]{6,16}$/)
    ]
    // 这里是相同的规则
    this.password2 = this.password1
  }
  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同')
    }
  }
}


/*
通知内容非空校验器
*/

class AnnouncementNotnullValidator extends LinValidator {
    constructor() {
        super()
        this.content = [
            new Rule('isLength', '通知信息不得为空', { min: 1 })
        ]
        this.from = [
            new Rule('isInt', '类型必须为整数且不能为空', { min: 0 }),
        ]
        this.to = [
            new Rule('isInt', '收件人类型必须为整数且不能为空', { min: 0 }),
        ]
    }
    async validateToExits(vals) {
        const toId = vals.body.to
        const flag = await User.findOne({
            where: { id: toId }
        })
        if (!flag && toId != 0) {
            throw new Error('用户不存在')
        }
    }
}

/*
通知内容发送校验器
*/

class SendAnnouncementValidator extends LinValidator {
    constructor() {
        super()
    }
    async validateAnnocementExits(vals) {
        const ID = vals.body.id
        const flag = await Announcement.findOne({
            where: { id: ID }
        })
        if (!flag) {
            throw new Error('通知不存在')
        }
    }
}

/*
通知内容编辑校验器
*/

class ModifyAnnouncementValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', 'id不能为空', { min: 1 }),
        ]
        this.content = [
            new Rule('isLength', '通知信息不得为空', { min: 1 })
        ]
        this.from = [
            new Rule('isInt', '类型必须为整数且不能为空', { min: 0 }),
        ]
        this.to = [
            new Rule('isInt', '类型必须为整数且不能为空', { min: 0 })
        ]
    }
    async validateToExits(vals) {
        const toId = vals.body.to
        const flag = await User.findOne({
            where: { id: toId }
        })
        if (!flag && toId != 0) {
            throw new Error('用户不存在')
        }
    }
    async validateAnnocementExits(vals) {
        const ID = vals.body.id
        const flag = await Announcement.findOne({
            where: { id: ID }
        })
        if (!flag) {
            throw new Error('通知不存在')
        }
    }
}


/*
通知删除校验器
*/

class DeleteAnnouncementValidator extends LinValidator {
    constructor() {
        super()
    }
    async validateAnnocementExits(vals) {
        const ID = vals.body.id
        const flag = await Announcement.findOne({
            where: { id: ID }
        })
        if (!flag) {
            throw new Error('通知不存在')
        }
    }
}

/*
通知展示校验器
*/

class AdminShowAnnouncementValidator extends LinValidator {
    constructor() {
        super()
    }
    async validateToExits(vals) {
        const toId = vals.body.from
        const flag = await User.findOne({
            where: { id: toId }
        })
        if (!flag && toId != 0) {
            throw new Error('用户不存在')
        }
    }
}

class UserShowAnnouncementValidator extends LinValidator {
    constructor() {
        super()
    }
    async validateToExits(vals) {
        const toId = vals.body.to
        const flag = await User.findOne({
            where: { id: toId }
        })
        if (!flag && toId != 0) {
            throw new Error('用户不存在')
        }
    }
}


module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  NotEmptyValidator,
  LoginParametersValidator,
  AccountDesignateValidator,
  UserInfoValidator,
  TagInfoValidator,
  LibraryInfoValidator,
  DesignateValidator,
  AddAdminValidator,
  AddChapterValidator,
  DeleteTagValidator,
  TagModifyValidator,
  AddExerciseValidator,
  ModifyExerciseValidator,
  IsLibraryExistValidator,
  QueryPaperValidator,
  AddPaperModelValidator,
  AssemblePaperValidator,
  AddExamValidator,
  ModifyExamValidator,
  BanLibraryValidator,
  IsLibraryAccessibleValidator,
  ActivateLibraryValidator,
  ExerciseExistenceValidator,
  ModifyLibraryValidator,
  ResetPasswordValidator,
  AnnouncementNotnullValidator,
  ModifyAnnouncementValidator,
  SendAnnouncementValidator,
  DeleteAnnouncementValidator,
  AdminShowAnnouncementValidator,
  UserShowAnnouncementValidator,
}