module.exports = KeywordParser;

const exec  = require("child_process").exec;
const CON_REQUEST_MAX = 10;
const CON_REQUEST_MAX_SEND_NOTIFY = 1000;

var AbtractParser = require(__dir + "/app/log-parser/abtract-parser");

function KeywordParser() {

    var self = this;

    this.init = function () {
        console.log('Init KeywordParser');
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
            exec(commands[key],
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
                        log: [item]
                    };
                } else {
                    suspectedLog[keyword].count += countRequest;
                    suspectedLog[keyword].log.push(item);
                }
            }
        }
        for (const key in suspectedLog) {
            if (suspectedLog[key].count > CON_REQUEST_MAX_SEND_NOTIFY) {
                let subject = 'ATTACK DETECTOR phát hiện ' + self.siteName + ' đang bị request nhiều lần';
                let content = 'Đường dẫn chứa từ khóa "' + key + '" bị request ' + suspectedLog[key].count + ' lần trong ' + self.numberLine + ' dòng cuối file ' + self.path + '\n';
                content += 'Chi tiết:\n';
                for (let i = 0; i < suspectedLog[key].log.length; i++) {
                    content += suspectedLog[key].log[i] + '\n';
                }
                console.log('KeywordParser send notify with keyword ' + key);
                self.sendEmail(subject, content, null);
            }
        }
    }   



}

KeywordParser.prototype = new AbtractParser;