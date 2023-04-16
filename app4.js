const moment = require("moment");

let task = //[
    {"name": "coding" ,"imp": 16 ,"min": 54}//,
    // {"name": "coding" ,"imp": 16 ,"min": 32},
    // {"name": "coding" ,"imp": 16 ,"min": 13}
// ];

function create_i(inp) {
    let inp_dev = Math.floor(inp % 25);
    let inp_dev2 = Math.floor(inp / 25);
    if(inp_dev > 13 && inp_dev < 20) {
        inp_dev2++;
    }
    return [ inp_dev2 , inp_dev ];
}
let splited = [];
function split(tasks) {
    let itr = create_i(task.min);
    if(task.min > 25){
        for(let i = 0;i < itr[0];i++) {
            if(i === 0) {
                splited.push({"min": itr[1] + 25});
            } else {
                splited.push({"min": 25});
            }
        }
    } else {
        splited.push({"min": task.min});
    }
    console.log(itr[0])
}
// task.forEach((task) => {
    split(task);
// })
console.log(splited)