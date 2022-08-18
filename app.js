global.__dir = __dirname;

const Schedule = require(__dir + "/app/schedule");
let schedule = new Schedule();
schedule.init();
