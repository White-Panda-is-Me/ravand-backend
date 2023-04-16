const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();

const checkTimeOverlap = (start_time1, end_time1, start_time2, end_time2) => {
  const dt1 = moment(`1970-01-01T${start_time1}:00Z`);
  const dt2 = moment(`1970-01-01T${end_time1}:00Z`);
  const dt3 = moment(`1970-01-01T${start_time2}:00Z`);
  const dt4 = moment(`1970-01-01T${end_time2}:00Z`);

  const overlap = ((dt1 <= dt4) && (dt1 >= dt3)) || ((dt2 >= dt3) && (dt2 <= dt4));
  return overlap;
};

app.use(bodyParser.json());

app.post('/schedule', (req, res) => {
  const { tasks, blocked_times, startTime } = req.body;
  const shuffledTasks = tasks.sort(() => Math.random() - 0.5);

  const total_time = moment.duration(6, 'hours'); // 6 hours in milliseconds

  const work_time = moment.duration(25, 'minutes'); // 25 minutes of work in milliseconds
  const rest_time = moment.duration(5, 'minutes'); // 5 minutes of rest in milliseconds

  // Calculate the total importance score of all tasks
  const total_score = tasks.reduce((sum, task) => sum + (task.importance + (task.minLen / 15)), 0);

  // Calculate the duration of each task based on its importance score
  const tasksWithDuration = shuffledTasks.map(task => {
    const duration = total_time * ((task.importance + (task.minLen / 15)) / total_score);
    return { ...task, duration };
  });

  // Create a schedule by adding up the durations of each task and breaks
  const start_time = moment(`1970-01-01T${startTime}:00Z`);
  const end_time = moment(start_time).add(total_time);
  const schedule = [];

  tasksWithDuration.forEach((task, i) => {
    let task_start_time = moment(start_time).add(schedule.reduce((sum, t) => sum + t.duration.asMilliseconds(), 0));
    const task_end_time = moment(task_start_time).add(task.duration);

    // Break the task into smaller time periods of work and rest
    while (task_start_time < task_end_time) {
      for (const blocked_time of blocked_times) {
        const tts = moment(task_start_time).add(work_time);
        const overlaps = checkTimeOverlap(task_start_time.format('HH:mm'), tts.format('HH:mm'), blocked_time.startTime, blocked_time.endTime);
        if (overlaps) {
            const time_st = moment(`1970-01-01T${blocked_time.startTime}:00Z`);
            const time_en = moment(`1970-01-01T${blocked_time.endTime}:00Z`);
            const timedelta_st = time_st.hours() * 60 * 60 * 1000 + time_st.minutes() * 60 * 1000;
            const timedelta_en = time_en.hours() * 60 * 60 * 1000 + time_en.minutes() * 60 * 1000;
            const task_start_timedelta = task_start_time.hours() * 60 * 60 * 1000 + task_start_time.minutes() * 60 * 1000 + task_start_time.seconds() * 1000;
            //const blocked
            const timedelta_end = moment(`1970-01-01T${blocked_time.endTime}:00Z).diff(moment(1970-01-01T00:00:00Z`));
            const remaining_time = moment.duration(timedelta_end - task_start_timedelta);
            if (remaining_time < work_time) {
                task_start_time = moment(`1970-01-02T${blocked_time.endTime}:00Z`);
                continue;
            } else {
                task_start_time = moment(task_start_time).add(remaining_time - rest_time);
                break;
            }
        }
        const task_end_time_diff = moment(task_end_time).diff(moment("1970-01-01T00:00:00Z"));
        const task_start_time_diff = moment(task_start_time).diff(moment("1970-01-01T00:00:00Z"));
        const remaining_time = moment.duration(task_end_time_diff - task_start_time_diff);
        if (remaining_time < work_time) {
            break;
        }
        schedule.push({
            task: task,
            start_time: task_start_time.format('HH:mm'),
            end_time: moment(task_start_time).add(work_time).format('HH:mm')
        });
        task_start_time = moment(task_start_time).add(work_time).add(rest_time);
      }
    }
}
res.json({ schedule });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});