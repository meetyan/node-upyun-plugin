const upyun = require('upyun');
const fs = require('fs');
const glob = require('glob');
const log = require('./util/log');

class UpyunService {
  constructor(options) {
    const { name, operator, password, folderPath } = options;
    this.state = {
      name,
      operator,
      password,
      folderPath,
      files: []
    };

    this._init();
  }

  // 初始化
  async _init() {
    const { name, operator, password } = this.state;

    // 检查必要参数是否传入
    const isParamValid = this._checkParams({ name, operator, password });
    if (!isParamValid) return;

    this.service = new upyun.Service(name, operator, password);
    this.client = new upyun.Client(this.service);
  }

  // 检查参数
  _checkParams(fields) {
    for (let key in fields) {
      const field = fields[key];

      if (!field) {
        log.error(`缺少必要参数 ${key}。请确保参数传入且不能为空`);
        return false;
      }
    }

    return true;
  }

  // 读取文件
  _readFolder() {
    const folderPath = this.state.folderPath;
    const pattern = folderPath + '/**/*';

    const fileList = glob.sync(pattern).map(path => {
      const name = path.replace(folderPath, '');
      const result = {
        name,
        path
      };

      return result;
    });

    if (!fileList.length) {
      log.prompt('该目录没有文件，请检查后再上传');
      return;
    }

    this.state.files = fileList;
  }

  // 上传单个文件
  async _uploadFile(file) {
    const localFile = fs.readFileSync(file.path);
    log.warn(`${file.path}，请稍候...`, '正在上传');

    const onSuccess = () => log.success('上传成功');
    const onError = () => log.error('上传失败');

    await this.client
      .putFile(file.name, localFile)
      .then(onSuccess)
      .catch(onError);
  }

  // 列出目录下所有文件
  _listDir() {
    this.client.listDir('/').then(res => console.log(res));
  }

  // 上传所有文件
  async upload() {
    this._readFolder();
    const { files } = this.state;

    for (let file of files) {
      // 检查是否文件夹，防止报错
      const isDirectory = fs.lstatSync(file.path).isDirectory();
      if (!isDirectory) {
        await this._uploadFile(file);
      }
    }

    log.success('所有文件均上传成功');
  }

  // 删除单个文件
  async removeFile(path = '') {
    // 遍历所有文件，删除，或删除指定
    log.prompt(`正在删除文件 ${path}...`);
    const isSuccess = await this.client.deleteFile(path);
    if (isSuccess) {
      log.success('删除成功');
    } else {
      log.error('删除失败');
    }
  }
}

module.exports = UpyunService;
