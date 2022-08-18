module.exports = IpParser;

const exec  = require("child_process").exec;
const CON_REQUEST_MAX = 400;

var AbtractParser = require(__dir + "/app/log-parser/abtract-parser");

function IpParser() {

    var self = this;
    this.command = `tail -n ` + self.numberLine + ` `+ self.path + ` | cut -f 1 -d ' ' | sort | uniq -c | sort -nr`;

    this.init = function () {
        console.log('Init IpParser');
        this.excCommand();
    }

    this.excCommand = function () {
        console.log('Execute command: ' + this.command);
        exec(this.command, {maxBuffer: 1024 * 500},
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
        console.log('IpParser parsing log');
        let arrLogs = self.convertToArrayByNewLine(data);
        let suspectedLog = [];
        for (let i = 0; i < arrLogs.length; i++) {
            let item = arrLogs[i].trim();
            let logAnalysis = item.split(' ');
            let countRequest = parseInt(logAnalysis[0]);
            if (countRequest < CON_REQUEST_MAX) {
                break;
            }
            if (countRequest >= CON_REQUEST_MAX && self.ipIgnores.indexOf(logAnalysis[1]) < 0) {
                suspectedLog.push(item);
            }
        }
        if (suspectedLog.length > 0) {
            let subject = 'ATTACK DETECTOR phát hiện ' + self.siteName + ' đang bị request nhiều bất thường.';
            let content = 'Danh sách ip request nhiều bất thường trong ' + self.numberLine + ' dòng cuối file ' + self.path + '\n';
                content += 'Chi tiết:\n';
            for (let i = 0; i < suspectedLog.length; i++) {
                content += suspectedLog[i] + '\n';
            }
            console.log('IpParser send notify');
            self.sendEmail(subject, content, null);
        }
    }

}

IpParser.prototype = new AbtractParser;