# node-upyun-plugin

又拍云云存储 Node.js 文件上传工具

![npm version](https://img.shields.io/npm/v/node-upyun-plugin)
![](https://img.shields.io/npm/l/node-upyun-plugin)
![](https://img.shields.io/maintenance/yes/2030)
![](https://img.shields.io/github/languages/code-size/realfrancisyan/node-upyun-plugin)

## 效果演示

![https://i.imgur.com/7B64sRo.gif](https://i.imgur.com/7B64sRo.gif)

## 安装

```terminal
npm install -D node-upyun-plugin
```

## 使用方法：

在项目根目录新建 `upyun.js` 文件（[示例](https://github.com/realfrancisyan/node-upyun-plugin/blob/master/upyun.example.js)），并按照如下信息填入：

```js
const UpyunService = require('node-upyun-plugin');

// 填入又拍云的信息
const us = new UpyunService({
  name: 'example name', // 服务名称
  operator: 'example operator', // 操作员
  password: 'example password', // 操作员密码，如 CSCn3zXXqUNQUl6wrDv1xCAA0NlBro88
  folderPath: 'build' // 上传目录，无需 './'
});

us.upload(); // 上传
```

如果想如效果演示般在命令行运行，可于 `package.json` 中添加一条命令：

```js
// package.json
...

  "scripts": {
    ...
    "upyun": "node upyun.js"
    ...
  }

...
```

## API 调用

### 1. upload(options)

上传文件

#### 参数

- `options`: （可选）
  - `removeAll`: 是否上传前，先删除所有文件，默认 `false`
  - `localPath`: 指定上传目录，默认为 `folderPath`
  - `remotePath`: 指定上传到又拍云的目录，默认为根目录

#### 示例

```js
const options = {
  removeAll: false,
  localPath: 'build/static',
  remotePath: 'path/to/example'
};
us.upload(options);
```

### 2. removeAll()

删除目录所有文件

### 3. removeFile(path)

删除某个文件

#### 示例

```js
us.removeFile('static/media/icon-unliked.04c36067.svg');
```

### 4. listDir(remotePath = '/', limit)

展示某个文件夹的所有文件

#### 示例

```js
us.listDir('static', 200);
```

## 支持

若本插件对您有帮助，欢迎 star 和 fork。

如果在使用过程中发现有问题或疑问，欢迎提交 [issue](https://github.com/realfrancisyan/node-upyun-plugin/issues)。

## pr
remove