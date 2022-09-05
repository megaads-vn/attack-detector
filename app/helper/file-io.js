const fs = require("fs");

module.exports.ip_attacker_path = '/app/storage/attacker';
module.exports.log_email_path = '/app/storage/email';

module.exports.exists = function exists(path) {
    let retVal = false;
    try {
        if (fs.existsSync(path)) {
            retVal = true;
        }
    } catch(err) {
        console.error(err)
    }
    return retVal;
}

module.exports.createFile = function createFile(path) {
    try {
        if (!fs.existsSync(path)) {
            fs.closeSync(fs.openSync(path, 'w'));
        }
    } catch(err) {
        console.error(err)
    }
}

module.exports.createDirectory = function createDirectory(dir) {
    try {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch(err) {
        console.error(err)
    }
}   

module.exports.write = function write(file, row) {
    row = row + '\r\n';
    try {
        fs.appendFileSync(file, row);
    } catch(err) {
        console.error(err)
    }
}

module.exports.read = function read(file) {
    let data = [];
    try {
        data = fs.readFileSync(file, 'utf8').split('\r\n');
    } catch(err) {
        console.error(err)
    }
    return data;
}   
