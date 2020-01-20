# node-upyun-plugin

又拍云云存储 Node.js 文件上传工具

## 安装

```terminal
npm install -D node-upyun-plugin
```

## 使用方法：

注意：在调用上传方法前，必须调用 `init()` 初始化又拍云，否则报错

```js
const UpyunService = require('node-upyun-plugin');

// 填入又拍云的信息
const us = new UpyunService({
  name: 'example name', // 服务名称
  operator: 'example operator', // 操作员
  password: 'CSCn3zXXqUNQUl6wrDv1xCAA0NlBro88', // 操作员密码
  folderPath: 'build' // 需要上传的生产环境目录，无需 './'
});

us.init(); // （必须）初始化又拍云
us.upload(); // 上传
```
