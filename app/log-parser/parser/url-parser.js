module.exports = UrlParser;

const exec  = require("child_process").exec;
const FileIo = require(__dir + '/app/helper/file-io');
const Utils = require(__dir + '/app/helper/utils');
const CON_REQUEST_MAX = 10;
const CON_REQUEST_MAX_SEND_NOTIFY = 1000;
const PATH_LOG = __dir + FileIo.ip_attacker_path + '/url-parser';


var AbtractParser = require(__dir + "/app/log-parser/abtract-parser");

function UrlParser() {

    var self = this;
    this.command = `tail -n ` + self.numberLine + ` ` + self.path + ` | awk '{print $1, $7}' |sort | uniq -c | sort -nr`;

    this.init = function () {
        console.log('Init UrlParser');
        FileIo.createDirectory(PATH_LOG);

        this.excCommand();
    }

    this.excCommand = function () {
        console.log('Execute command: ' + this.command);
        exec(this.command, {maxBuffer: 1024 * 1000},
            (error, stdout, stderr) => {
                this.parserLog(stdout);
                if (stderr != '') {
                    console.log(`stderr: ${stderr}`);
                }
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
    }

    this.parserLog = function (data) {
        console.log('UrlParser parsing log');
        let nameFile = Utils.getDateMakeName();
        let path = PATH_LOG + '/' + nameFile;
        FileIo.createFile(path);
        let arrLogs = self.convertToArrayByNewLine(data);
        let suspectedLog = {};
        for (let i = 0; i < arrLogs.length; i++) {
            let item = arrLogs[i].trim();
            let logAnalysis = item.split(' ');
            let countRequest = parseInt(logAnalysis[0]);
            if (countRequest < CON_REQUEST_MAX) {
                break;
            }
            if (countRequest >= CON_REQUEST_MAX && self.ipIgnores.indexOf(logAnalysis[1]) < 0) {
                if (typeof suspectedLog[logAnalysis[2]] == 'undefined') {
                    suspectedLog[logAnalysis[2]] = {
                        count: countRequest,
                        log: [logAnalysis[1] + ' ' + logAnalysis[2]]
                    };
                } else {
                    suspectedLog[logAnalysis[2]].count += countRequest;
                    suspectedLog[logAnalysis[2]].log.push(logAnalysis[1] + ' ' + logAnalysis[2]);
                }
            }
        }
        let logs = FileIo.read(path);
        for (const key in suspectedLog) {
            if (suspectedLog[key].count > CON_REQUEST_MAX_SEND_NOTIFY) {
                for (let i = 0; i < suspectedLog[key].log.length; i++) {
                    if (logs.indexOf(suspectedLog[key].log[i]) < 0) {
                        FileIo.write(path, suspectedLog[key].log[i]);
                    }
                }
            }
        }
    }  

}

UrlParser.prototype = new AbtractParser;