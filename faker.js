const faker = require('faker')
const axios = require('axios')

/**
 * mock 普通用户
 */
class FakeUser {
  constructor() {
    this.email = faker.internet.email()
    this.password1 = '123Wang'
    this.password2 = '123Wang'
    this.username = faker.name.lastName()
    this.account = 'test' + parseInt(4 + Math.random() * 50).toString().padStart(3, '0')
    this.sex = 1
  }
  static toJson() {
    let testUser = {}
    const obj = new FakeUser()
    return testUser = {
      email: obj.email,
      password1: obj.password1,
      password2: obj.password2,
      username: obj.username,
      account: obj.account,
      sex: obj.sex
    }
  }
}

/**
 * mock 题库管理员
 */
class FakeAdmin {
  constructor() {
    this.password1 = '123Wang'
    this.password2 = '123Wang'
    this.username = faker.name.firstName()
    this.account = 'admin' + parseInt(1 + Math.random() * 50).toString().padStart(3, '0')
  }
  static toJson() {
    let testUser = {}
    const obj = new FakeAdmin()
    return testUser = {
      password1: obj.password1,
      password2: obj.password2,
      username: obj.username,
      account: obj.account,
    }
  }
}



// for (let i = 0; i < 10; i++) {
//   let user = FakeUser.toJson()
//   try {
//     axios({
//       method: 'post',
//       url: 'http://localhost:3000/v1/user/register',
//       data: {
//         ...user
//       }
//     }).then(function (response) {
//       console.log(response.data);
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
//   } catch {

//   }
// }

// for (let i = 0; i < 10; i++) {
//   let admin = FakeAdmin.toJson()
//   try {
//     axios({
//       method: 'post',
//       url: 'http://localhost:3000/v1/user/distribute',
//       data: {
//         ...admin
//       }
//     }).then(function (response) {
//       console.log(response.data);
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
//   } catch {

//   }
// }