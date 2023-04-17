const { log } = require("console");
const moment = require("moment");

let tasks = [
    {"name": "math", "imp": 15 ,"min": 92 ,"score": null},
    {"name": "arabic", "imp": 4 ,"min": 10 ,"score": null},
    {"name": "coding", "imp": 20 ,"min": 70 ,"score": null},
    {"name": "coding2" ,"imp": 12 ,"min" :54 ,"score": null},
    {"name": "coding3" ,"imp": 3 ,"min" :20 ,"score": null},
    {"name": "coding4" ,"imp": 9 ,"min" :19 ,"score": null}
];
let start_time = moment("12:00" ,"HH:mm");
let end_time = moment("21:00" ,"HH:mm");
let blocked_time = [
    {"name": "hashemi" ,"start": moment("15:30" ,"HH:mm") ,"end": moment("16:00" ,"HH:mm")},
    {"name": "hashemi" ,"start": moment("17:30" ,"HH:mm") ,"end": moment("18:30" ,"HH:mm")}
]
let sorted_list = [];
let to;
let blocked_i = 0;

let total_time = () => {
    let sum = 0;
    for(let it = 0;it < tasks.length;it++) {
        sum += tasks[it]["min"];
    }
    return sum;
}

function create_i(inp) {
    let inp_dev = Math.floor(inp % 25);
    let inp_dev2 = Math.floor(inp / 25);
    inp_dev2++;
    return [ inp_dev2 , inp_dev ];
}

function sort_tasks() {
    for(let i in tasks) {
        tasks[i]["score"] = (tasks[i]["min"] / 15) + tasks[i]["imp"];
    }
    tasks.sort((a ,b) => b.score - a.score);
}

sort_tasks();

blocked_time[0].start.subtract(10 ,"minutes");
blocked_time[1].start.subtract(10 ,"minutes");
function split_sort(task) {
    let itr = create_i(task.min);
    if(task.min > 25){
        for(let i = 0;i < itr[0] ;i++) {
            if(i === 0) {
                if(itr[1] > 9){
                    to = moment(start_time ,"HH:mm");
                    to.add((itr[1]) ,"minutes");
                    if(to.isBetween(blocked_time[blocked_i].start ,blocked_time[blocked_i].end)) {
                        blocked_time[blocked_i].start.add(10 ,"minutes");
                        sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("HH:mm") ,"to": blocked_time[blocked_i].end.format("HH:mm")})
                        blocked_time[blocked_i].start.subtract(10 ,"minutes");
                        start_time = moment(blocked_time[blocked_i].end);
                        to = start_time;
                        // start_time.add((itr[1] + 25) ,"minutes");
                        if(blocked_i < blocked_time.length - 1)
                            blocked_i++;
                    } else {
                        sorted_list.push({"name": task.name ,"from": start_time.format("HH:mm") ,"to": to.format("HH:mm")});
                        start_time.add((itr[1] + 5) ,"minutes");
                        sorted_list.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start_time.format("HH:mm")});
                    }
                }
            } else {
                to = moment(start_time ,"HH:mm");
                to.add(25 ,"minutes");
                if(moment(to).isBetween(blocked_time[blocked_i].start ,blocked_time[blocked_i].end)) {
                    blocked_time[blocked_i].start.add(10 ,"minutes");
                    sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("HH:mm") ,"to": blocked_time[blocked_i].end.format("HH:mm")})
                    blocked_time[blocked_i].start.subtract(10 ,"minutes");
                    start_time = moment(blocked_time[blocked_i].end);
                    to = start_time;
                    // start_time.add(task.min ,"minutes");
                    if(blocked_i < blocked_time.length - 1)
                    blocked_i++;
                } else {
                    sorted_list.push({"name": task.name ,"from": start_time.format("HH:mm") ,"to": to.format("HH:mm")});
                    start_time.add(30 ,"minutes");
                    sorted_list.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start_time.format("HH:mm")});
                }
            } 
        }
    } else {
        to = moment(start_time ,"HH:mm");
        to.add(task.min ,"minutes")
        if(moment(to).isBetween(blocked_time[blocked_i].start ,blocked_time[blocked_i].end)) {
            blocked_time[blocked_i].start.add(10 ,"minutes");
            sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("HH:mm") ,"to": blocked_time[blocked_i].end.format("HH:mm")})
            blocked_time[blocked_i].start.subtract(10 ,"minutes");
            start_time = moment(blocked_time[blocked_i].end);
            to = start_time;
            // start_time.add(task.min ,"minutes");
            if(blocked_i < blocked_time.length - 1)
                blocked_i++;
        } else {
            sorted_list.push({"name": task.name ,"from": start_time.format("HH:mm") ,"to": to.format("HH:mm")});
            start_time.add(task.min + 5 ,"minutes");
            sorted_list.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start_time.format("HH:mm")});
        }
    }
}

if((total_time() + (Math.floor(total_time() / 30)) * 5) > (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes")))) {

    tasks.forEach((task) => {
        split_sort(task);
    })
} else {
    let diff = (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes"))) - (total_time() + (Math.floor(total_time() / 30)) * 5);
    log(diff)
    tasks.forEach((task) => {
        
        // task.min -= (Math.floor(diff / tasks.length) + Math.floor(task.min / 25) + 1);
        split_sort(task);
    })
}

sorted_list.pop();

console.log(sorted_list);