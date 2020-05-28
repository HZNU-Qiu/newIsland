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
const { UserExam } = require('../models/user_exam')

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
            new Rule('isInt', '类型只有两种', { min: 0, max: 1 })
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
            `SELECT type FROM exercise WHERE id in (${problemStr})`, { raw: true })
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
        const num = await db.query(sql, { raw: true }).then(obj => {
            return obj[0][0].num
        })
        if (num !== 0) {
            throw new Error('该题库有考试不能禁用')
        }
    }
}

/**
 * 题库删除
 */
class DeleteLibraryValidator extends PositiveIntegerValidator {
    constructor() {
        super()
    }
    async validateLibraryHasBanned(vals) {
        const id = vals.path.id
        const library = await Library.findOne({
            where: {
                id,
                status: 0
            }
        })
        if (!library) {
            throw new Error('题库不存在或者题库未被禁用')
        }
        const chapter = await Chapter.findOne({
            where: {
                library_id: id
            }
        })
        if (chapter) {
            throw new Error('题库内还有章节,先删除所有章节再删除题库')
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
        const toId = vals.path.id
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
        const toId = vals.path.id
        const flag = await User.findOne({
            where: { id: toId }
        })
        if (!flag && toId != 0) {
            throw new Error('用户不存在')
        }
    }
}

/**
 * 用户考试报名校验器
 */
class UserEnrollValidator extends LinValidator {
    constructor() {
            super()
            this.user_id = [
                new Rule('isInt', '用户id不能为空', { min: 1 })
            ]
            this.exam_id = [
                new Rule('isInt', '考试id不能为空', { min: 1 })
            ]
            this.start = [
                new Rule('isLength', '考试开始时间不能为空', { min: 1 })
            ]
            this.end = [
                new Rule('isLength', '考试结束时间不能为空', { min: 1 })
            ]
        }
        // 校验用户是否已经报名考试
    async validateHasEnrolled(vals) {
            const { user_id, exam_id } = vals.body
            const record = await UserExam.findOne({
                where: {
                    user_id,
                    exam_id
                }
            })
            if (record) {
                throw new Error('用户已报名此考试')
            }
        }
        // 校验考试是否可以报名
    async validateExamAccessible(vals) {
        const { user_id, exam_id, start, end } = vals.body
        let now = new Date().getTime() / 1000
        let startTime1 = new Date(start).getTime() / 1000
        let endTime1 = new Date(end).getTime() / 1000
        if (now + 300 >= startTime1) {
            throw new Error('距开考还有不到5分钟，不得报名')
        }
        const exam = await Exam.findByPk(exam_id)
        if (!exam) {
            throw new Error('考试不存在')
        } else if (exam.status != 0) {
            throw new Error('考试已经结束报名')
        }
        let has = await db.query(`
    SELECT e.start,e.end FROM exam e LEFT 
    JOIN user_exam u ON u.exam_id=e.id 
    WHERE u.user_id=${user_id} AND e.status<2
    `, { raw: true })
        has = has[0]
        has.map(item => {
            let startTime2 = new Date(item.start).getTime() / 1000
            let endTime2 = new Date(item.end).getTime() / 1000
            if ((startTime1 >= startTime2 && endTime1 <= endTime2) || (startTime1 < startTime2 && endTime1 >= startTime2) || (startTime1 > startTime2 && startTime2 < endTime2)) {
                throw new Error('考试冲突')
            }
        })
    }
}

/**
 * 学生弃考校验器
 */
class AbandonExamValidator extends PositiveIntegerValidator {
    constructor() {
        super()
    }
    async validateAbandonAccess(vals) {
        const userId = vals.extra.userId
        const examId = vals.path.id
        let data = await db.query(`
    SELECT e.start FROM exam e 
    LEFT JOIN user_exam u ON e.id = u.exam_id
    WHERE u.user_id=${userId} AND u.exam_id=${examId} 
    `, { raw: true })
        data = data[0].start
        let now = new Date().getTime() / 1000
        let examStart = new Date(data).getTime() / 1000
        if (now + 180 >= examStart) {
            throw new Error('开考3分钟内不得弃考，开始考试后更不能弃考!')
        }
    }
}

/**
 * 学生考试作答校验器
 */
class RecordPreserveValidator extends LinValidator {
    constructor() {
            super()
            this.exam_id = [
                new Rule('isInt', '考试编号必须为正整数', { min: 1 })
            ]
            this.problem_id = [
                new Rule('isInt', '题目编号必须为正整数', { min: 1 })
            ]
        }
        /**
         * 校验是否可以提交
         */
    async validateAccessToAdmit(vals) {
        const { exam_id } = vals.body
        let exam = await Exam.findByPk(exam_id)
        let now = new Date().getTime() / 1000
        let start = new Date(exam.start).getTime() / 1000
        let end = new Date(exam.end).getTime() / 1000
        if (now < start) {
            throw new Error('考试还未开始不能答题')
        } else if (now >= end) {
            throw new Error('考试已结束不能答题')
        }
    }
}

/**
 * 考试开始校验器
 */
class StartToExamValidator extends PositiveIntegerValidator {
    constructor() {
            super()
        }
        /**
         * 是否可以开始考试
         */
    async validateExamIsStart(vals) {
        const id = vals.path.id
        let exam = await Exam.findByPk(id)
        let now = new Date().getTime() / 1000
        let start = new Date(exam.start).getTime() / 1000
        let end = new Date(exam.end).getTime() / 1000
        if (now < start) {
            throw new Error('考试还没有开始')
        }
    }
}

/**
 * 批改试卷校验器
 */
class JudgeValidator extends PositiveIntegerValidator {
    constructor() {
            super()
        }
        // 校验考试是否已经结束
    async validateExamIsEnd(vals) {
        const exam_id = vals.path.id
        const exam = await Exam.findByPk(exam_id)
        if (parseInt(exam.status) !== 2) {
            throw new Error('现在不是改卷阶段不能改卷')
        }
    }
}

/**
 * 删除章节校验器
 */
class DeleteChapterValidator extends PositiveIntegerValidator {
    constructor() {
            super()
        }
        // 校验删除权限
    async validateAccessToDeleteChapter(vals) {
        const id = vals.path.id
        const chapter = await Chapter.findByPk(id)
        if (parseInt(chapter.exercise_num) !== 0) {
            throw new Error('章节下有题目，先删除所有题目')
        }
    }
}

/**
 * 删除题目校验器
 */
class DeleteExerciseValidator extends PositiveIntegerValidator {
    constructor() {
            super()
            this.chapter = [
                new Rule('isInt', '章节id为正整数', { min: 1 })
            ]
        }
        // 题目是否可以删除
    async validateAccessToDeleteExercise(vals) {
        const { id, chapter } = vals.query
        const record = await Exercise.findOne({
            where: {
                id,
                chapter
            }
        })
        if (!record) {
            throw new Error('章节号与题目id不对应')
        }
        let sql = `
    SELECT DISTINCT p.problem_list FROM paper p 
    JOIN chapter c ON c.library_id=p.library_id
    JOIN exercise e ON e.chapter=c.id
    WHERE e.id=${id}
    `
        let problem_list = await db.query(sql, { raw: true })
        problem_list = problem_list[0]
        problem_list.map(item => {
            let testArr = item.problem_list.split(',')
            if (testArr.includes(id)) {
                throw new Error('题目已被编入试卷，请先将题目从试卷中删除')
            }
        })
    }
}

/**
 * 禁用试卷校验器
 */
class BanPaperValidator extends PositiveIntegerValidator {
    constructor() {
            super()
        }
        // 是否可以禁用校验
    async validateAccessToBanPaper(vals) {
        const id = vals.path.id
        const paper = await Paper.findOne({
            where: {
                id,
                status: 1
            }
        })
        if (!paper) {
            throw new Error('试卷不存在或者已被禁用')
        } else if (parseInt(paper.type) === 2) {
            const exam = await Exam.findOne({
                where: {
                    paper_id: id
                }
            })
            if (exam) {
                throw new Error('该试卷已纳入考试，请先清理考试记录')
            }
        }
    }
}

/**
 * 批量删除用户考试记录校验器
 */
class ClearByBatchValidator extends PositiveIntegerValidator {
    constructor() {
        super()
    }
    async validateAccessToClear(vals) {
        const id = vals.path.id
        const exam = await Exam.findByPk(id)
        if (parseInt(exam.status) !== 3) {
            throw new Error('考试还没有结束不能删除用户考试记录')
        }
    }
}

/**
 * 某个用户考试记录校验器
 */
class ClearUserExamValidator extends LinValidator {
    constructor() {
            super()
            this.user_id = [
                new Rule('isInt', '用户id为正整数', { min: 1 })
            ]
            this.exam_id = [
                new Rule('isInt', '考试id为正整数', { min: 1 })
            ]
        }
        // 校验开始记录是否可以删除
    async validateAccessToDeleteUserExam(vals) {
        const { user_id, exam_id } = vals.query
        const record = await UserExam.findOne({
            where: {
                user_id,
                exam_id
            }
        })
        if (!record) {
            throw new Error('记录不存在,或已被删除')
        } else {
            const exam = await Exam.findByPk(exam_id)
            if (parseInt(exam.status) !== 3) {
                throw new Error('考试还没有结束不能删除用户考试记录')
            }
        }
    }
}

/**
 * 试卷删除校验器
 */
class DeletePaperValidator extends PositiveIntegerValidator {
    constructor() {
        super()
    }
    async validatePaperhasBanned(vals) {
        const id = vals.path.id
        const paper = await Paper.findOne({
            where: {
                id,
                status: 0
            }
        })
        if (!paper) {
            throw new Error('试卷不存在或者被未被禁用')
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
    UserEnrollValidator,
    AbandonExamValidator,
    RecordPreserveValidator,
    StartToExamValidator,
    JudgeValidator,
    DeleteChapterValidator,
    DeleteExerciseValidator,
    BanPaperValidator,
    ClearUserExamValidator,
    ClearByBatchValidator,
    DeletePaperValidator,
    DeleteLibraryValidator,


}