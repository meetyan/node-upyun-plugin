const UpyunService = require('node-upyun-plugin');

// 填入又拍云的信息
const us = new UpyunService({
  name: 'example name', // 服务名称
  operator: 'example operator', // 操作员
  password: 'example password', // 操作员密码，如 CSCn3zXXqUNQUl6wrDv1xCAA0NlBro88
  folderPath: 'build' // 上传目录，无需 './'
});

us.upload(); // 上传
