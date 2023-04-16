const moment = require("moment");

let task = //[
    {"name": "coding" ,"imp": 16 ,"min": 54}//,
    // {"name": "coding" ,"imp": 16 ,"min": 32},
    // {"name": "coding" ,"imp": 16 ,"min": 13}
// ];

function create_i(inp) {
    let inp_dev = Math.floor(inp % 25);
    let inp_dev2 = Math.floor(inp / 25);
    if(inp_dev > 13) {
        inp_dev2++;
    }
    return [ inp_dev2 , inp_dev ];
}
let splited = [];
function split(tasks) {
    if(task.min > 25){
        for(let i = 0;i < create_i(task.min)[0];i++) {
            if(i === 0) {
                splited.push({"min": create_i(task.min)[1] + 25});
            } else {
                splited.push({"min": 25});
            }
        }
    } else {
        splited.push({"min": task.min});
    }
}
// task.forEach((task) => {
    split(task);
// })
console.log(splited)