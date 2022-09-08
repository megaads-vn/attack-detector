const FileIo = require(__dir + '/app/helper/file-io');
const Utils = require(__dir + '/app/helper/utils');
const PATH_EMAIL = __dir + FileIo.log_email_path;

exports.index = function index(req, res) {
    let pathLog = PATH_EMAIL + '/' + Utils.getNameFileByDate();
    let ips = getIps(pathLog);
    let octet = req.query.class;
    let ipParsers = parserClassIp(ips);
    let response = {
        status: 'successful',
        result: []
    };
    if (!octet) {
        response.result = ips;
    }
    if (octet == 'a') {
        response.result = ipParsers.classA;
    }
    if (octet == 'b') {
        response.result = ipParsers.classB;
    }
    if (octet == 'c') {
        response.result = ipParsers.classC;
    }
    res.send(response);
};

const parserClassIp = function parserClassIp(ips) {
    let classA = [];
    let classB = [];
    let classC = [];
    for (let i = 0; i < ips.length; i++) {
        let arrIps = ips[i].split('.');
        if (arrIps.length == 4) {
            let a = arrIps[0];
            let b = arrIps[0] + '.' + arrIps[1];
            let c = arrIps[0] + '.' + arrIps[1] + '.' + arrIps[2];
            if (classA.indexOf(a) < 0) {
                classA.push(a);
            }
            if (classB.indexOf(b) < 0) {
                classB.push(b);
            }
            if (classC.indexOf(c) < 0) {
                classC.push(c);
            }
        }
    }
    return {
        classA: classA,
        classB: classB,
        classC: classC
    }
}

const getIps = function getIps (path) {
    let retVal = [];
    if (FileIo.exists(path)) {
        retVal = FileIo.read(path);
    }
    return retVal;
}
