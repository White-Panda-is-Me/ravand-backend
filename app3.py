
import datetime
import random
from flask import Flask, jsonify,request

def check_time_overlap(start_time1, end_time1, start_time2, end_time2):
    dt1 = datetime.datetime.strptime(start_time1, '%H:%M')
    dt2 = datetime.datetime.strptime(end_time1, '%H:%M')
    dt3 = datetime.datetime.strptime(start_time2, '%H:%M')
    dt4 = datetime.datetime.strptime(end_time2, '%H:%M')

    overlap = ((dt1 <= dt4) and (dt1 >= dt3)) or ((dt2 >= dt3) and (dt2 <= dt4))
    return overlap

app = Flask(__name__)

@app.route('/schedule', methods=['POST'])
def generate_plan():
    tasks = request.json['tasks']
    random.shuffle(tasks)

    blocked_times = request.json['blocked_times']
    total_time = datetime.timedelta(hours=6)  # 5 hours

    work_time = datetime.timedelta(minutes=25)  # 25 minutes of work
    rest_time = datetime.timedelta(minutes=5)   # 5 minutes of rest

    # Calculate the total importance score of all tasks
    total_score = sum(task["importance"] + (task["minLen"] / 15) for task in tasks)

    # Calculate the duration of each task based on its importance score
    for task in tasks:
        duration = total_time * ((task["importance"] + (task["minLen"] / 15)) / total_score)
        task["duration"] = duration
    
    startTime = request.json['startTime']
    # Create a schedule by adding up the durations of each task and breaks
    start_time = datetime.datetime.strptime(startTime, '%H:%M')
    end_time = start_time + total_time
    schedule = []

    for i, task in enumerate(tasks):
        task_start_time = start_time + datetime.timedelta(seconds=sum(t["duration"].total_seconds() for t in schedule))
        task_end_time = task_start_time + task["duration"]
        

        # Break the task into smaller time periods of work and rest
        while task_start_time < task_end_time:
            for blocked_time in blocked_times:
                tts = task_start_time + datetime.timedelta(minutes=30)
                overlaps = check_time_overlap(task_start_time.strftime('%H:%M'), tts.strftime('%H:%M'), blocked_time['startTime'], blocked_time['endTime'])
                if overlaps:
                    time_st = datetime.datetime.strptime(blocked_time['startTime'], '%H:%M').time()
                    time_en = datetime.datetime.strptime(blocked_time['endTime'], '%H:%M').time()
                    timedelta_st = datetime.timedelta(hours=time_st.hour, minutes=time_st.minute)
                    timedelta_en = datetime.timedelta(hours=time_en.hour, minutes=time_en.minute)
                    task_start_timedelta = datetime.timedelta(hours=task_start_time.time().hour, minutes=task_start_time.time().minute)
                    st_perv = task_start_time
                    task_start_time = task_start_time + timedelta_en - task_start_timedelta
                    task_end_time = task_end_time + timedelta_en - task_start_timedelta + datetime.timedelta(minutes=30)
                    schedule.append({"duration": task_start_time - st_perv, "name": blocked_time['name'], "start_time": st_perv, "end_time":  task_start_time})
                    
            if task_start_time + work_time <= task_end_time:
                # Add a work period to the schedule
                schedule.append({"duration": work_time, "name": task["name"], "start_time": task_start_time, "end_time": task_start_time + work_time})
                task_start_time += work_time
                # Add a rest period to the schedule
                if task_start_time + rest_time <= task_end_time:
                    schedule.append({"duration": rest_time, "name": "Break", "start_time": task_start_time, "end_time": task_start_time + rest_time})
                    task_start_time += rest_time
            else:
                # Add a final work period to the schedule, without a break afterwards
                schedule.append({"duration": task_end_time - task_start_time, "name": task["name"], "start_time": task_start_time, "end_time": task_end_time})
                task_start_time = task_end_time
        
        if i != len(tasks) - 1:
            # Add a break between tasks, if there is enough time
            break_start_time = task_end_time
            break_end_time = break_start_time + rest_time
            if break_end_time <= end_time:
                schedule.append({"duration": rest_time, "name": "Break", "start_time": break_start_time, "end_time": break_end_time})
    result = []
    for i in schedule:
        i['start_time'] = i['start_time'].isoformat()
        i['end_time'] = i['end_time'].isoformat()
        i['duration'] = None
        result.append(i)

    
    return jsonify(result)