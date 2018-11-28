const fs = require('fs');
const path = require('path');
const Storage = exports = module.exports = {};
const store = new WeakMap();

Storage.getFile = async function (hash, url)  {
    const CurrentDate = new Date().getTime();
    const file = store.get(hash);
    if (file) {
        if (file.expirationDate < CurrentDate) {
            return  file
        } else {
            Storage.clearFile(hash, file);
            return {err: `file has been expired`};
        }
    } else {
        const localFile = await getLocalFile(hash, url);
        if (localFile) {
            if ((localFile.expirationDate < CurrentDate)) {
                return  localFile
            } else {
                console.log(localFile);
                Storage.clearFile(hash, localFile);
                return {err: `file has been expired`};
            }
        } else {
            return {err: `file does not exist`};
        }
    }
};

Storage.setFile = async function (hash, file) {
    if (file.url && hash) {
        store.set(hash, file);
       await writeFile (hash, file);
        return file;
    } else {
        return {err: `url or hash is undefined`}
    }
};

Storage.clearFile = async function (hash, file) {
    if (!file.url) return {err: `file does not exist`};

    const dir = splitUrl(file.url);
    let filePath = `./${dir.join('/')}/${hash}.txt`;

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }else {
        return;
    }

    let i = dir.length;
    while( i > 0) {
        let subDir = `./${dir.slice(0, i).join('/')}`;
        const dirFiles =  await fs.readdirSync(subDir);
        const files = dirFiles.filter(f => !fs.lstatSync(subDir + "/" + f).isDirectory());
        const dirs = dirFiles.filter(f => fs.lstatSync(subDir + "/" + f).isDirectory());

        if (files.length > 0 || dirs.length > 1) {
            break;
        } else {
            fs.rmdirSync(subDir);
        }
        i--;
    }
};

const splitUrl = function (url) {
    return url.split(new RegExp("[/|?|#|&]", "g"));
};

const makeDirectory = async function (url) {
    const dir = splitUrl(url);
    let path = '.';
    dir.forEach( dirName => {
        path = `${path}/${dirName}`;
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    });
    return path;
};

const writeFile = async function (hash, file) {
    const path = await makeDirectory(file.url);
    fs.writeFile(`./${path}/${hash}.txt`, JSON.stringify(file), function (err) {
        if (err) throw err;
        console.log(`file stored at ${path}`);
        return file;
    });
};

const getLocalFile = async function (hash, url) {
    const dir = splitUrl(url);
    let path = `./${dir.join('/')}/${hash}.txt`;
    if (fs.existsSync(path)) {
        const content = await fs.readFileSync(path, 'utf8');
        return JSON.parse(content);
    } else {
        return false;
    }
};