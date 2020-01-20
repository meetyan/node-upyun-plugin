const chalk = require('chalk');

exports.error = (msg = '') => {
  console.log(chalk`{bgBlack.red 错误！} {red ${msg}}`);
};

exports.prompt = (msg = '') => {
  console.log(chalk`{bgBlack.yellow 提示：} {yellow ${msg}}`);
};

exports.warn = (msg = '', label = '警告') => {
  console.log(chalk`{bgBlack.yellow ${label}：} {yellow ${msg}}`);
};

exports.success = (msg = '') => {
  console.log(chalk`{bgBlack.green 成功：} {green ${msg}}`);
};
