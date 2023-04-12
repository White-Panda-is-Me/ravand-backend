const moment = require("moment");

function sort(list) {
    for(let i = 0;i < list.length;i++) {
        list[i]["score"] = (list[i]["imp"] + (list[i]["min"] / 15));
    }
    list.sort((a ,b) => {
        return b["score"] - a["score"];
    });
}

function split_sort(list) {
    let total_time = 0;
    let start = moment("15:00" ,"hh:mm").format("hh:mm");
    let to;
    const end = moment("21:00" ,"hh:mm").format("hh:mm");
    const blocked_time = [moment("17:00", "hh:mm").format("hh:mm") ,moment("18:00" ,"hh:mm").format("hh:mm")];
    // const rest = {
    //     "name": "rest",
    //     "from": null,
    //     "to": null
    // }

    let splited_tasks = [];
    for(let i = 0;i < list.length;i++) {
        total_time += list[i]["min"];
    }
    if(total_time > (Math.abs(moment(start ,"hh:mm").diff(moment(end ,"hh:mm"))) - moment(blocked_time[0] ,"hh:mm").diff(moment(blocked_time[1] ,"hh:mm")))) {
        console.log("cannot sort because tasks times is not dividable by the tim you've entered");
        return 0;
    } else {
        let it = 0;
        while(it < list.length) {

            if(list[it]["min"] < 46) {
                if(moment(start ,"hh:mm").add(list[it]["min"]).isBefore(moment(blocked_time[0] ,"hh:mm"))){
                    splited_tasks.push({"name": list[it]["name"] ,"from": start,"to": moment(start, "hh:mm").add(list[it]["min"] ,"minutes").format("hh:mm") });
                    start = moment(start ,"hh:mm").add(list[it]["min"] ,"minutes").format("hh:mm");
                    splited_tasks.push({"name": "rest" ,"from": start ,"to": moment(start, "hh:mm").add(5 ,"minutes").format("hh:mm") });
                    start = moment(start ,"hh:mm").add(5 ,"minutes").format("hh:mm");
                    it += (5+list[it]["min"]);
                    // console.log(to);
                } else {
                    if(Math.abs(moment(start ,"hh:mm").diff(moment(blocked_time[0] ,"hh:mm") ,"minutes")) < 11) {
                        start = blocked_time[1];
                    } else {
                        
                    }
                }
                console.log(splited_tasks);
            } else {
                continue;
            }

            // if(list[it]["min"] == 0) {
            //     it++;
            // }
        }
    }
}

let tasks = [
    {"name": "math", "imp": 10 ,"min": 95},
    {"name": "arabic", "imp": 15 ,"min": 50},
    {"name": "coding", "imp": 20 ,"min":37}
];

sort(tasks);
split_sort(tasks);
// console.log(tasks);