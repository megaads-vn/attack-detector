module.exports = KeywordParser;

const exec  = require("child_process").exec;
const FileIo = require(__dir + '/app/helper/file-io');
const Utils = require(__dir + '/app/helper/utils');
const CON_REQUEST_MAX = 10;
const CON_REQUEST_MAX_SEND_NOTIFY = 1000;
const PATH_LOG = __dir + FileIo.ip_attacker_path + '/keyword-parser';

var AbtractParser = require(__dir + "/app/log-parser/abtract-parser");

function KeywordParser() {

    var self = this;

    this.init = function () {
        console.log('Init KeywordParser');
        FileIo.createDirectory(PATH_LOG);
        this.excCommand();
    }

   function getCommand() {
        let retVal = {};
        for (let i = 0; i < self.keywords.length; i++) {
            retVal[self.keywords[i]] = `tail -n ` + self.numberLine + ` ` + self.path + ` | grep "` + self.keywords[i] + `" |cut -f 1 -d ' '|sort|uniq -c | sort -nr`;
        }
        return retVal;
    }

    this.excCommand = function () {
        let commands = getCommand();
        for (const key in commands) {
            console.log('Execute command: ' + commands[key]);
            exec(commands[key], {maxBuffer: 1024 * 1000},
                (error, stdout, stderr) => {
                    this.parserLog(stdout, key);
                    if (stderr != '') {
                        console.log(`stderr: ${stderr}`);
                    }
    
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
        }
    }

    this.parserLog = function (data, keyword) {
        console.log('KeywordParser parsing log');
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
                if (typeof suspectedLog[keyword] == 'undefined') {
                    suspectedLog[keyword] = {
                        count: countRequest,
                        log: [logAnalysis[1] + ' ' + logAnalysis[2]]
                    };
                } else {
                    suspectedLog[keyword].count += countRequest;
                    suspectedLog[keyword].log.push(logAnalysis[1] + ' ' + logAnalysis[2]);
                }
            }
        }
        let logs = FileIo.read(path);
        for (const key in suspectedLog) {
            if (suspectedLog[key].count > CON_REQUEST_MAX_SEND_NOTIFY) {
                if (logs.indexOf(suspectedLog[key].log[i]) < 0) {
                    FileIo.write(path, suspectedLog[key].log[i]);
                }
            }
        }
    }

}

KeywordParser.prototype = new AbtractParser;