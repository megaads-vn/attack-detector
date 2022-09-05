module.exports = Monitor;

const FileIo = require(__dir + '/app/helper/file-io');
const Utils = require(__dir + '/app/helper/utils');
const appConfig = require(__dir + '/app/config/app');
const Email = require(__dir + '/app/helper/email');
const PATH_EMAIL = __dir + FileIo.log_email_path;

function Monitor() {
    var self = this;
    this.logPaths = [
        'ip-parser', 'keyword-parser', 'url-parser'
    ];

    this.nameFile = Utils.getDateMakeName();

    this.init = function () {
        FileIo.createDirectory(PATH_EMAIL);
        this.parseLog();
    }

    this.parseLog = function () {
        let ips = [];
        for (let i = 0; i < self.logPaths.length; i++) {
            let path = __dir + FileIo.ip_attacker_path + '/' + self.logPaths[i] + '/' + self.nameFile;
            if (FileIo.exists(path)) {
                let data = FileIo.read(path);
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let items = data[i].split(' ');
                        if (items.length > 1 && ips.indexOf(items[0]) < 0) {
                            ips.push(items[0]);
                        }
                    }
                }
            }
        }
       this.warning(ips);
    }

    this.warning = function (data) {
        let result = [];
        let path = __dir + FileIo.log_email_path + '/' + self.nameFile;
        let sent = this.getIpSent(path);
        for (let i = 0; i < data.length; i++) {
            if (sent.indexOf(data[i]) < 0) {
                result.push(data[i]);
            }
        }
        const isEmpty = result.length === 0;
        if (!isEmpty) {
            this.sendWarning(result, path);
        }
    }

    this.sendWarning = function (data, path) {
        FileIo.createFile(path);
        let subject = 'ATTACK DETECTOR phát hiện ' + appConfig.site_name + ' đang bị request nhiều bất thường \n';
        let content = 'Danh sách ip tấn công được tự động sinh chặn cho .htaccess: \n';
        for (let i = 0; i < data.length; i++) {
            content += 'Deny from ' + data[i] + '\n';
            FileIo.write(path, data[i]);
        }
        Email.sendEmail(subject, content, null);
    }

    this.getIpSent = function (path) {
        let retVal = [];
        if (FileIo.exists(path)) {
            retVal = FileIo.read(path);
        }
        return retVal;
    }



    
}