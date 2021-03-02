const path = require('path');
const fs = require('fs');
const tar = require('tar-fs');
const zlib = require('zlib');
const execSync = require('child_process').execSync;

const ignoreCheckRef = process.argv.slice(2);
console.log(ignoreCheckRef);

const options = {
  // 打包包名
  packname: 'web',
  // 打包分支
  packRefs: ['origin/develop', 'origin/master', 'origin/release']
};

const refName = execSync('git show -s --format=%d')
  .toString()
  .trim();
let canPack = false;
options.packRefs.forEach(ref => {
  if (refName.indexOf(ref) !== -1) {
    canPack = true;
  }
});
const skipCheckRef = process.argv.slice(2)[0];
if (skipCheckRef) {
  pack();
} else {
  if (!canPack) {
    throw new Error('请切换到 develop|master|release 分支打包!');
  } else {
    pack();
  }
}

function deleteFile(delPath, direct) {
  delPath = direct ? delPath : path.join(__dirname, delPath);
  try {
    /**
     * @des 判断文件或文件夹是否存在
     */
    if (fs.existsSync(delPath)) {
      fs.unlinkSync(delPath);
    } else {
      console.log('inexistence path：', delPath);
    }
  } catch (error) {
    console.log('del error', error);
  }
}

function deleteFolder(delPath) {
  // delPath = path.join(__dirname, delPath);
  try {
    if (fs.existsSync(delPath)) {
      const delFn = function(address) {
        const files = fs.readdirSync(address);
        for (let i = 0; i < files.length; i++) {
          const dirPath = path.join(address, files[i]);
          if (fs.statSync(dirPath).isDirectory()) {
            delFn(dirPath);
          } else {
            deleteFile(dirPath, true);
          }
        }
        /**
         * @des 只能删空文件夹
         */
        fs.rmdirSync(address);
      };
      delFn(delPath);
    } else {
      console.log('do not exist: ', delPath);
    }
  } catch (error) {
    console.log('del folder error', error);
  }
}

function copyFolder(copiedPath, resultPath, direct) {
  console.log(copiedPath, resultPath);
  if (!direct) {
    copiedPath = path.join(__dirname, copiedPath);
    resultPath = path.join(__dirname, resultPath);
  }

  function createDir(dirPath) {
    fs.mkdirSync(dirPath);
  }

  if (fs.existsSync(copiedPath)) {
    createDir(resultPath);
    /**
     * @des 方式一：利用子进程操作命令行方式
     */
    // child_process.spawn('cp', ['-r', copiedPath, resultPath])

    /**
     * @des 方式二：
     */
    const files = fs.readdirSync(copiedPath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
      const cf = files[i];
      const ccp = path.join(copiedPath, cf.name);
      const crp = path.join(resultPath, cf.name);
      if (cf.isFile()) {
        /**
         * @des 创建文件,使用流的形式可以读写大文件
         */
        const readStream = fs.createReadStream(ccp);
        const writeStream = fs.createWriteStream(crp);
        readStream.pipe(writeStream);
      } else {
        try {
          /**
           * @des 判断读(R_OK | W_OK)写权限
           */
          fs.accessSync(path.join(crp, '..'), fs.constants.W_OK);
          copyFolder(ccp, crp, true);
        } catch (error) {
          console.log('folder write error:', error);
        }
      }
    }
  } else {
    console.log('do not exist path: ', copiedPath);
  }
}

function pack() {
  if (!fs.existsSync(path.resolve(__dirname, './temp'))) {
    console.log('没有temp文件夹，创建temp目录...');
    fs.mkdirSync(path.resolve(__dirname, './temp'));
  }
  const packageDir = path.resolve(__dirname, `temp/${options.packname}`);
  if (!fs.existsSync(packageDir)) {
    console.log('不存在文件夹');
    // fs.mkdirSync(packageDir);
  } else {
    deleteFolder(packageDir);
  }
  copyFolder(path.resolve(__dirname, '../dist'), packageDir, true);

  tar
    .pack(path.resolve(__dirname, 'temp'), {
      finish: function() {
        console.log('压缩tar.gz文件');
        let frReader = fs
          .createReadStream(path.resolve(__dirname, options.packname + '.tar'))
          .pipe(zlib.createGzip())
          .pipe(
            fs.createWriteStream(
              path.resolve(__dirname, options.packname + '.tar.gz')
            )
          );
        frReader.on('finish', () => {
          console.log('成功压缩文件');
        });
      }
    })
    .pipe(
      fs.createWriteStream(path.resolve(__dirname, options.packname + '.tar'))
    );
}
