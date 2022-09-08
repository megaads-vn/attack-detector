module.exports = IpParser;

const exec  = require("child_process").exec;
const FileIo = require(__dir + '/app/helper/file-io');
const Utils = require(__dir + '/app/helper/utils');
const PATH_LOG = __dir + FileIo.ip_attacker_path + '/ip-parser';

var AbtractParser = require(__dir + "/app/log-parser/abtract-parser");

function IpParser() {

    var self = this;
    this.command = `tail -n ` + self.numberLine + ` `+ self.path + ` | cut -f 1 -d ' ' | sort | uniq -c | sort -nr`;

    this.init = function () {
        FileIo.createDirectory(PATH_LOG);
        this.excCommand();
    }

    this.excCommand = function () {
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
        let nameFile = Utils.getNameFileByDate();
        let path = PATH_LOG + '/' + nameFile;
        FileIo.createFile(path);
        let arrLogs = self.convertToArrayByNewLine(data);
        let suspectedLog = [];
        for (let i = 0; i < arrLogs.length; i++) {
            let item = arrLogs[i].trim();
            let logAnalysis = item.split(' ');
            let countRequest = parseInt(logAnalysis[0]);
            if (countRequest < self.numberRequestWarning) {
                break;
            }
            if (countRequest >= self.numberRequestWarning && self.ipIgnores.indexOf(logAnalysis[1]) < 0) {
                suspectedLog.push(logAnalysis[1]);
            }
        }
        let logs = FileIo.read(path);
        if (suspectedLog.length > 0) {
            for (let i = 0; i < suspectedLog.length; i++) {
                if (logs.indexOf(suspectedLog[i]) < 0) {
                    FileIo.write(path, suspectedLog[i]);
                }
            }
        }
    }

}

IpParser.prototype = new AbtractParser;