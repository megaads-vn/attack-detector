module.exports = UrlParser;

const exec  = require("child_process").exec;
const CON_REQUEST_MAX = 10;
const CON_REQUEST_MAX_SEND_NOTIFY = 1000;


var AbtractParser = require(__dir + "/app/log-parser/abtract-parser");

function UrlParser() {

    var self = this;
    this.command = `tail -n ` + self.numberLine + ` ` + self.path + ` | awk '{print $1, $7}' |sort | uniq -c | sort -nr`;

    this.init = function () {
        console.log('Init UrlParser');
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
                        log: [item]
                    };
                } else {
                    suspectedLog[logAnalysis[2]].count += countRequest;
                    suspectedLog[logAnalysis[2]].log.push(item);
                }
            }
        }
        for (const key in suspectedLog) {
            if (suspectedLog[key].count > CON_REQUEST_MAX_SEND_NOTIFY) {
                let subject = 'ATTACK DETECTOR phát hiện ' + self.siteName + ' đang bị request nhiều lần vào url "' + key + '"';
                let content = 'URL ' + key + ' bị request ' + suspectedLog[key].count + ' lần trong ' + self.numberLine + ' dòng cuối file ' + self.path + '\n';
                content += 'Chi tiết:\n';
                for (let i = 0; i < suspectedLog[key].log.length; i++) {
                    content += suspectedLog[key].log[i] + '\n';
                }
                console.log('UrlParser send notify');
                self.sendEmail(subject, content, null);
            }
        }
    }   



}

UrlParser.prototype = new AbtractParser;