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
      files: [], // 本地上传文件
      remoteFiles: [] // 存储在又拍云的目录文件
    };

    this._init();
  }

  // 初始化
  async _init() {
    const { name, operator, password, folderPath } = this.state;

    // 检查必要参数是否传入
    const isParamValid = this._checkParams({
      name,
      operator,
      password,
      folderPath
    });
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

  _validateService() {
    if (!this.service) {
      log.error('找不到 service，请确保服务参数已正确传入');
      return false;
    }
    if (!this.client) {
      log.error('找不到 client，请确保服务参数已正确传入');
      return false;
    }

    return true;
  }

  // 读取文件
  _readFolder(folderPath = this.state.folderPath) {
    const pattern = folderPath + '/**/*';

    const fileList = glob.sync(pattern).map(path => {
      const name = path.replace(folderPath, '');
      const result = { name, path };

      return result;
    });

    if (!fileList.length) {
      log.prompt('该目录没有文件，请检查后再上传');
      return;
    }

    this.state.files = fileList;
  }

  // 上传单个文件
  async _uploadFile(file, remotePath) {
    const localFile = fs.readFileSync(file.path);
    log.warn(`${file.path}，请稍候...`, '正在上传');

    const onSuccess = () => log.success('上传成功');
    const onError = () => log.error('上传失败');

    remotePath = remotePath ? `${remotePath}/${file.name}` : file.name;

    await this.client
      .putFile(remotePath, localFile)
      .then(onSuccess)
      .catch(onError);
  }

  // 列出目录下所有文件
  async listDir(remotePath = '/', limit = 10000) {
    if (!this._validateService()) return;

    const options = { limit };
    const fileList = await this.client.listDir(remotePath, options);
    if (!fileList) log.error('读取文件夹失败！请检查目录是否存在');

    for (let file of fileList.files) {
      const path =
        remotePath === '/' ? file.name : `${remotePath}/${file.name}`;

      if (file.type !== 'F') {
        file.remotePath = path;
        this.state.remoteFiles.push(file);
      } else {
        await this.listDir(path); // 如果是文件夹，递归遍历
      }
    }
  }

  // 删除单个文件
  async removeFile(path) {
    if (!this._validateService()) return;
    if (!path) return;

    // 遍历所有文件，删除，或删除指定
    log.prompt(`正在删除文件 ${path}...`);
    const isSuccess = await this.client.deleteFile(path);
    if (isSuccess) {
      log.success('删除成功');
    } else {
      log.error('删除失败');
    }
  }

  // 上传所有文件
  async upload(options = {}) {
    if (!this._validateService()) return;

    // 上传前，是否先删除所有文件
    const { removeAll = false, localPath, remotePath } = options;
    if (removeAll) await this.removeAll();

    this._readFolder(localPath);
    const { files } = this.state;

    for (let file of files) {
      // 检查是否文件夹，防止报错
      const isDirectory = fs.lstatSync(file.path).isDirectory();
      if (!isDirectory) {
        await this._uploadFile(file, remotePath);
      }
    }

    if (files.length) log.success('所有文件均上传成功');
  }

  // 删除目录下所有文件
  async removeAll() {
    if (!this._validateService()) return;

    await this.listDir();

    const { remoteFiles } = this.state;

    for (let file of remoteFiles) {
      await this.removeFile(file.remotePath);
    }

    log.success('删除所有文件成功');
  }
}

module.exports = UpyunService;
