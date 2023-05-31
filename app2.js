const moment = require("moment");

//  defining variables
let blocked = [
    {"name": "asd" ,"start": moment("14:00" ,"HH:mm") ,"end": moment("16:00" ,"HH:mm")},
    {"name": "asd" ,"start": moment("9:30" ,"HH:mm") ,"end": moment("11:00" ,"HH:mm")}
];
let start = moment("9:00" ,"HH:mm");
let end = moment("23:00" ,"HH:mm");
let to = moment(start);
let diff = 0;
let tasks = [
    {"name": "riazi" ,"min": 70 ,"imp": 12},
    {"name": "hello" ,"min": 50 ,"imp": 20},
    {"name": "farsi" ,"min": 80 ,"imp": 4},
    {"name": "arabic" ,"min": 120 ,"imp": 13}
];
let blocked_itr = 0;
let sorted_tasks = [];
let parted_tasks = [];
let all_blocked = 0;
let all_tasks = 0;

tasks.map((task) => {
    all_tasks += task.min;
});
blocked.map((bl) => {
    all_blocked += Math.abs(bl.start.diff(bl.end ,"minutes"));
});
blocked.sort((a ,b) => a.start.toDate() - b.start.toDate());

if(blocked[0].start.isBefore(start)) {
    start = moment(blocked[0].start);
} else if(blocked[blocked.length - 1].end.isAfter(end)) {
    end = blocked[blocked.length - 1].end;
}

let total_diff = (Math.abs(start.diff(end ,"minutes")) - all_blocked) - all_tasks;

//  sorting all tasks based on their importance
tasks.sort((a ,b) => b.imp - a.imp);

//  function to check how many times should a task be parted
function iterate(task) {
    if(task.min < 35) {
        return [1 ,task.min];
    } else {
        if(task.min % 25 < 10) {
            return [Math.floor(task.min / 25) ,25 + task.min % 25];
        } else {
            return [Math.floor(task.min / 25) + 1,task.min % 25];
        }
    }
}


//  parting tasks 25 by 25 minutes
tasks.map((task ,i1) => {
    const it = iterate(task);
    for(let i = 0;i < it[0];i++) {
        if(i === 0) {
            parted_tasks.push({"tag": task.name ,"times": it[0]});
            parted_tasks.push({"name": task.name ,"min": it[1]});
        } else {
            parted_tasks.push({"name": task.name ,"min": 25});
        }
    }
    if(i1 === (tasks.length - 1)) {
        parted_tasks.push({"ended": true});
    }
});

//  sorting tasks in the defined time
for(let i = 0;i < parted_tasks.length;i++) {
    if(tasks.length === (parted_tasks.length - 1)) {
        break;
    } else if(parted_tasks[i].tag && parted_tasks[i].times !== 0) {
        start.add(parted_tasks[i + 1].min + 5 ,"minutes");
        if(start.isBetween(blocked[blocked_itr].start ,blocked[blocked_itr].end) || start.isSame(blocked[blocked_itr].start)) {
            start.subtract(parted_tasks[i + 1].min + 5 ,"minutes");
            if(!start.isAfter(blocked[blocked_itr].start)) {
                diff = Math.abs(start.diff(moment(blocked[blocked_itr].start) ,"minutes"));
            } else {
                diff = parted_tasks[i + 1].min;
            }
            if(diff > 10) {
                to = moment(blocked[blocked_itr].start);
                sorted_tasks.push({"name": parted_tasks[i + 1].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                sorted_tasks.push({"name": blocked[blocked_itr].name ,"from": blocked[blocked_itr].start.format("HH:mm") ,"to": blocked[blocked_itr].end.format("HH:mm")});
                start = moment(blocked[blocked_itr].end);
                to = moment(start);
                if(start.isSameOrAfter(end)) {
                    sorted_tasks.splice(sorted_tasks.length - 2);
                    break;
                }
                parted_tasks.splice(i + 1 ,1);
                start.add(diff + 5 ,"minutes");
                sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                to.add(5 ,"minutes");
                parted_tasks[i].times--;
            } else {
                start = blocked[blocked_itr].end;
                to = moment(start);
                sorted_tasks.push({"name": blocked[blocked_itr].name ,"from": blocked[blocked_itr].start.format("HH:mm") ,"to": blocked[blocked_itr].end.format("HH:mm")});
            }
            if(blocked_itr < (blocked.length - 1)){
                blocked_itr++;
            }
        } else {
            start.subtract(parted_tasks[i + 1].min + 5 ,"minutes");
            to.add(parted_tasks[i + 1].min ,"minutes");
            sorted_tasks.push({"name": parted_tasks[i + 1].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
            start.add(parted_tasks[i + 1].min + 5 ,"minutes");
            parted_tasks.splice(i + 1 ,1);
            sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
            to.add(5 ,"minutes");
            parted_tasks[i].times--;
        }
    } else if(parted_tasks[i].ended === true) {
        i = -1;
    }
    if(start.isSameOrAfter(end)) {
        break;
    }
}

if(sorted_tasks[sorted_tasks.length - 1].name === "rest") {
    sorted_tasks.pop();
}

//  printing sorted tasks
console.log(sorted_tasks);
console.log(total_diff);