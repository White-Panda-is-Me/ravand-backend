// All Rigths Reserved
// Hipoo Team ®

const { log } = require("console");
const moment = require("moment");

//
//  defining variables
//

let blocked = [
    {"name": "some 1" ,"start": moment("12:00" ,"HH:mm") ,"end": moment("13:00" ,"HH:mm")},
    {"name": "some 2" ,"start": moment("14:00" ,"HH:mm") ,"end": moment("15:00" ,"HH:mm")},
];
let start = moment("10:00" ,"HH:mm");
let start2 = moment(start);
let end = moment("20:00" ,"HH:mm");
let to = moment(start);
let diff = 0;
let shd_loop = true;
let tasks = [
    {"name": "something 1" ,"min": 100 ,"imp": 20},
    {"name": "something 2" ,"min": 50 ,"imp": 14},
    {"name": "something 3" ,"min": 190 ,"imp": 10},
    {"name": "something 4" ,"min": 40 ,"imp": 16}
];
let tasks2 = [];
let blocked2 = [];
let sorted_tasks = [];
let m_itr = 0;
let g_diff = 0;
let break_flag = false;

function edit_end() {
    let itr = sorted_tasks.length - 1;
    let from = moment(sorted_tasks[itr].from ,"HH:mm");
    let to = moment(sorted_tasks[itr].to ,"HH:mm");

    while(1 && shd_loop){
        if(to.isAfter(end)) {
            sorted_tasks.splice(sorted_tasks.length - 1 , 1);
            itr--;
            to = moment(sorted_tasks[itr].to ,"HH:mm");
        } else {
            if(sorted_tasks[itr].name == "rest"){
                sorted_tasks.splice(sorted_tasks.length - 1 , 1);
                itr--;
                to = moment(sorted_tasks[itr].to ,"HH:mm");
            }
            sorted_tasks[itr].to = end.format("HH:mm");
            break;
        }
    }

    if(from.diff(to ,"minutes") < 9 && from.diff(to ,"minutes") > -9) {
        sorted_tasks.pop();
        sorted_tasks.pop();
        itr -= 2;
        sorted_tasks[itr].to = to.format("HH:mm");
    }
}


//
// adjusting the start or end time if they are after or before blocked times
//

if(blocked.length != 0 && blocked[0].start.isBefore(start)) {
    start = moment(blocked[0].start);
} else if(blocked.length != 0 && blocked[blocked.length - 1].end.isAfter(end)) {
    end = blocked[blocked.length - 1].end;
}

//
// sorting blocked times based on their start time
// sorting tasks based on their importance
//

blocked.sort((a ,b) => a.start.toDate() - b.start.toDate());
tasks.sort((a ,b) => b.imp - a.imp);

//
// taking a copy of tasks and blocks to use them in the feature
//

tasks2 = JSON.parse(JSON.stringify(tasks));
blocked2 = JSON.parse(JSON.stringify(blocked));

//
// This function checks if the loop continue to appending tasks to the sorted_tasks
// if the loop should continue it returns true otherwise it returns flase
//

function shd_con() {
    let ok = false;
    tasks.map((task) => {
        if(task.min > 5) {
            ok = true;
        }
    });
    return ok;
}

let i = 0;
for (m_itr = 0;m_itr < 2;m_itr++){
    log(start)
    log(end)
    log(blocked)
    // log()
    //
    // The main while loop goes here to append the tasks to the sorted_tasks
    //

    while (shd_con()) {

        //
        // The Default work_time according to the Pomodor Technique is 25 minutes
        //

        let work_len = 25;

        //
        // here we check if the whole time of a single task is between 35 and 5
        // if it is, The work_time would be the whole minutes of that task
        // Or if it would turn over the end time ,it just sets the work_time to the remaning time
        //

        if(tasks[i].min < 35 && tasks[i].min > 5) {
            work_len = tasks[i].min;
        } else if(end.diff(start ,"minutes") < 36) {
            work_len = end.diff(start ,"minutes");
            break_flag = true;
        }
        start.add(work_len ,"minutes");

        //
        // If the tasks would crash with a blocked time it appends the blocked time to the sorted_tasks
        // And the appends the task
        //

        if(blocked.length != 0 && (start.isBetween(blocked[0].start ,blocked[0].end) || start.isSameOrAfter(blocked[0].start))) {
            start.subtract(work_len ,"minutes");
            diff = start.diff(blocked[0].start ,"minutes");
            if (diff > 10) {
                to = moment(blocked[0].start);
                to.add(diff ,"minutes");
                sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                if(sorted_tasks[sorted_tasks.length - 1].name == "rest") {
                    sorted_tasks.splice(sorted_tasks.length - 1 ,1);
                }
                sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                start = moment(blocked[0].end);
                to = moment(start);
                
                if(start.isSameOrAfter(end)) {
                    sorted_tasks.splice(sorted_tasks.length - 2);
                    break;
                }
                
                tasks[i].min -= diff;
                start.add(diff + 5 ,"minutes");
                sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                to.add(5 ,"minutes");
            } else {
                start = moment(blocked[0].end);
                to = moment(start);
                if(sorted_tasks != 0 && sorted_tasks[sorted_tasks.length - 1].name == "rest") {
                    sorted_tasks.splice(sorted_tasks.length - 1 ,1);
                }
                sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                to.add(work_len ,"minutes");
                sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                
                if(start.isSameOrAfter(end)) {
                    sorted_tasks.splice(sorted_tasks.length - 1);
                    break;
                }
                
                tasks[i].min -= work_len;
                start.add(work_len + 5 ,"minutes");
                sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                to = moment(start);
            }
            
            if(blocked.length > 0)
                blocked.splice(0 ,1);
        
        // Otherwise if it wouldn't crash with the blocked times it just appends the task 

        } else {
            start.subtract(work_len ,"minutes");
            to = moment(start);
            to.add(work_len ,"minutes");
            tasks[i].min -= work_len;
            sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
            start.add((work_len + 5),"minutes");
            sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
        }

        //
        // Here we check for all tasks if they have less than 5 minutes remained, delete them
        //

        tasks.map((task ,it) => {
            if(task.min < 5) {
                tasks.splice(it ,1);
                i--;
            }
        });

        // Go to next iteration
        i++;

        // all last things for breaking from the loop

        if(break_flag)
            break;
        if(i == tasks.length)
            i = 0;
        if(tasks.length < 1)
            break;
    }

    //
    // Here is one of the most important parts of this code
    // At this part we check if the finished has a lot difference from the end time
    // It can either be more than end time or less than end time
    // So here we reset calculate the difference and add (difference / tasks.length) to each task
    // Then reset all needed variables and from the copied vasiables at the first
    // And the jump rigth at the start of the loop again and continue appending to the sorted_tasks
    //
    
    if(m_itr == 0)
        g_diff = end.diff(to ,"minutes");
    if((g_diff < 5 && g_diff > -5) || !shd_loop)
        break;
    else
        sorted_tasks = [];
        let quoit = (g_diff / tasks2.length);
        quoit = (Math.round(quoit / 5) * 5);
        g_diff = 0;
        tasks = tasks2;
        blocked2.map((bl) => {
            let s_index = bl.start.indexOf('T');
            let e_index = bl.end.indexOf('T');
            bl.start = moment(bl.start.substring(s_index + 1 ,s_index + 6) ,"HH:mm");
            bl.end = moment(bl.end.substring(e_index + 1 ,e_index + 6) ,"HH:mm");
            bl.start.add(210 ,"minutes");
            bl.end.add(210 ,"minutes");
        });
        blocked = blocked2;
        tasks.map((task) => {
            task.min += quoit;
        })
        start = moment(start2)
        to = moment(start)
}

//
// At the end just check if the last task is rest then delete that
//

if(sorted_tasks[sorted_tasks.length - 1].name === "rest") {
    sorted_tasks.pop();
}

//
//  printing sorted tasks
//

edit_end();

log(sorted_tasks);
