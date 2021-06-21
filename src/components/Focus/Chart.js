import React from 'react';
import './styles/Chart.scss';
import { Line } from 'react-chartjs-2';
import { convertMilli } from './helpers/convertMilli';

function Chart({ label, data }) {
	const sStart = data.start;
	const sEnd = data.end;

	const sStartDate = new Date(sStart.date.year, sStart.date.month, sStart.date.day, sStart.time.hours, sStart.time.minutes, sStart.time.seconds);
	const sEndDate = new Date(sEnd.date.year, sEnd.date.month, sEnd.date.day, sEnd.time.hours, sEnd.time.minutes, sEnd.time.seconds);

	const sStartTime = convertMilli(sStart.time.hours, 'hourM') + convertMilli(sStart.time.minutes, 'minM') + convertMilli(sStart.time.seconds, 'secM');
	const sEndTime = convertMilli(sEnd.time.hours, 'hourM') + convertMilli(sEnd.time.minutes, 'minM') + convertMilli(sEnd.time.seconds, 'secM');

	const timeDif = sEndTime - sStartTime;
	const xlabels = [];
	const ylabels = [];

	const { taskList, doneTasks } = data.sessionInfo.tasks;
	const totalTasks = taskList.concat(doneTasks);

	if (timeDif >= 3600000) {
		for (let i = sStartTime; i <= sEndTime; i = i + 600000) {
			xlabels.push(`${('0' + convertMilli(i, 'hour')).slice(-2)}:${('0' + convertMilli(i, 'min')).slice(-2)}`);
			ylabels.push(i + 1);
		}
	} else if (timeDif > 60000) {
		for (let i = sStartTime; i <= sEndTime; i = i + 60000) {
			xlabels.push(`${('0' + convertMilli(i, 'hour')).slice(-2)}:${('0' + convertMilli(i, 'min')).slice(-2)}`);
			ylabels.push(i + 1);
		}
	} else {
		for (let i = sStartTime; i <= sEndTime; i = i + 1000) {
			xlabels.push(`${('0' + convertMilli(i, 'hour')).slice(-2)}:${('0' + convertMilli(i, 'min')).slice(-2)}:${('0' + convertMilli(i, 'sec')).slice(-2)}`);
			ylabels.push(i + 1);
		}
	}

	const createDataPoints = (dataArr, y) => {
		let dataTimes = [];

		for (let i = 0; i <= dataArr.length - 1; i++) {
			let timeStart = dataArr[i].start;
			let timeEnd = dataArr[i].end;
			let secondsStart = timeDif < 60000 ? ':' + ('0' + timeStart.seconds).slice(-2) : '';
			let secondsEnd = timeDif < 60000 ? ':' + ('0' + timeEnd.seconds).slice(-2) : '';

			dataTimes.push(
				{
					x: `${('0' + timeStart.hours).slice(-2)}:${('0' + timeStart.minutes).slice(-2)}` + secondsStart,
					y: y,
					num: convertMilli(timeStart.hours, 'hourM') + convertMilli(timeStart.minutes, 'minM') + convertMilli(timeStart.seconds, 'secM'),
				},
				{
					x: `${('0' + timeEnd.hours).slice(-2)}:${('0' + timeEnd.minutes).slice(-2)}` + secondsEnd,
					y: y,
					num: convertMilli(timeEnd.hours, 'hourM') + convertMilli(timeEnd.minutes, 'minM') + convertMilli(timeEnd.seconds, 'secM'),
				},
				{
					x: NaN,
					y: y,
					num: 0,
				}
			);
		}
		return dataTimes;
	};

	let studyDataTimes = createDataPoints(data.sessionInfo.studyTimes, 1);

	let sBreakTimes = createDataPoints(data.sessionInfo.shortBreakTimes, 2);

	let lBreakTimes = createDataPoints(data.sessionInfo.longBreakTimes, 3);

	const createTaskPoints = (taskType, val, y) => {
		let tasks = [];

		for (let i = 0; i <= taskType.length - 1; i++) {
			let timeDis = taskType[i]['time' + val];
			let taskDate = taskType[i]['date' + val];
			let complDate = taskDate ? new Date(taskDate.year, taskDate.month, taskDate.day, timeDis.hours, timeDis.minutes, timeDis.seconds) : -1;

			let seconds = timeDif < 60000 && timeDis ? ':' + ('0' + timeDis.seconds).slice(-2) : '';

			if (complDate !== -1 && complDate > sStartDate && complDate < sEndDate) {
				tasks.push({
					x: timeDis && `${('0' + timeDis.hours).slice(-2)}:${('0' + timeDis.minutes).slice(-2)}` + seconds,
					y: timeDis && y,
					num: timeDis && convertMilli(timeDis.hours, 'hourM') + convertMilli(timeDis.minutes, 'minM') + convertMilli(timeDis.seconds, 'secM'),
				});
			}
		}
		return tasks;
	};

	let tasksStarted = createTaskPoints(totalTasks, '', 4);
	let tasksFinished = createTaskPoints(totalTasks, 'Finished', 4);
	let tasksReopened = createTaskPoints(totalTasks, 'Reopened', 4);

	const state = {
		labels: xlabels,
		datasets: [
			{
				label: ' Study Data ',
				backgroundColor: '#8eb798',
				borderColor: '#498551',
				data: studyDataTimes,
			},
			{
				type: 'line',
				label: ' Long Break ',
				backgroundColor: '#84acc9',
				borderColor: '#763ea8',
				data: lBreakTimes,
			},
			{
				label: ' Short Breaks ',
				backgroundColor: 'rgba(75,192,192,1)',
				borderColor: '#5599c5',
				data: sBreakTimes,
			},
			{
				type: 'scatter',
				label: ' Task Reopened ',
				backgroundColor: '#FFFF00',
				borderColor: '#5599c5',
				data: tasksReopened,
			},
			{
				type: 'scatter',
				label: ' Task Finished ',
				backgroundColor: '#0000FF',
				borderColor: '#5599c5',
				data: tasksFinished,
			},
			{
				type: 'scatter',
				label: ' Tasks Started ',
				backgroundColor: '#00FFFF',
				borderColor: '#5599c5',
				data: tasksStarted,
			},
		],
	};

	return (
		<div className='chart-container'>
			<Line
				data={state}
				options={{
					plugins: {
						title: {
							display: true,
							text: 'Study Data',
						},
					},
					scales: {
						x: {
							title: {
								display: true,
								text: 'Time',
							},
						},
						y: {
							title: {
								display: true,
								text: 'Type',
							},
							ticks: {
								stepSize: 1,
							},
						},
					},
				}}
			/>
		</div>
	);
}

export default Chart;
