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
// console.log(splited)








let time = moment("0:0" ,"H:m");
console.log(time.format("HH:mm"))
// console.log(time)
// time.add(1 ,"day")
// console.log(time)