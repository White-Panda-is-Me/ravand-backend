const moment = require("moment");

let task = {"name": "coding" ,"imp": 16 ,"min": 54}

function create_i(inp) {
    let inp_dev = Math.floor(inp % 25);
    let inp_dev2 = Math.floor(inp / 25);
    inp_dev2++;
    return [ inp_dev2 , inp_dev ];
}
let splited = [];
let shrink = 0;
function split(tasks) {
    let itr = create_i(task.min);
    if(task.min > 25){
        for(let i = 0;i < itr[0];i++) {
            if(i === 0) {
                if(itr[1] > 9){
                    splited.push({"min": itr[1]});
                } else {
                    shrink++;
                }
            } else {
                splited.push({"min": 25});
            }
        }
    } else {
        splited.push({"min": task.min});
    }
    itr[0] -= shrink;
    console.log(itr[0])
}
// task.forEach((task) => {
//     split(task);
// })
split(task)
console.log(splited)








// let time = moment("21:00" ,"hh:mm");
// let time1 = moment("20:00" ,"hh:mm");
// let time2 = moment("22:00" ,"hh:mm");
// if(time.isBetween(time1 ,time2)) {
//     console.log("yes")
// }