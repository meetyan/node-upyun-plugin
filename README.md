# node-upyun-plugin

又拍云云存储 Node.js 文件上传工具

## 安装

```terminal
npm install -D node-upyun-plugin
```

## 使用方法：

```js
const UpyunService = require('node-upyun-plugin');

// 填入又拍云的信息
const us = new UpyunService({
  name: 'example name', // 服务名称
  operator: 'example operator', // 操作员
  password: 'CSCn3zXXqUNQUl6wrDv1xCAA0NlBro88', // 操作员密码
  folderPath: 'build' // 上传目录，无需 './'
});

us.upload(); // 上传
```
