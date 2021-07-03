import React from 'react';
import './styles/Chart.scss';
import { Line } from 'react-chartjs-2';
import { convertMilli } from './helpers/convertMilli';

function Chart({ data }) {
	let yCount = 0;

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

	const createDataPoints = (dataArr) => {
		let dataTimes = [];
		for (let i = 0; i <= dataArr.length - 1; i++) {
			let timeStart = dataArr[i].start;
			let timeEnd = dataArr[i].end;
			let studyDate = dataArr[i].date;
			let secondsStart = timeDif < 60000 ? ':' + ('0' + timeStart.seconds).slice(-2) : '';
			let secondsEnd = timeDif < 60000 ? ':' + ('0' + timeEnd.seconds).slice(-2) : '';
			let xStart = `${('0' + timeStart.hours).slice(-2)}:${('0' + timeStart.minutes).slice(-2)}` + secondsStart;
			let xEnd = `${('0' + timeEnd.hours).slice(-2)}:${('0' + timeEnd.minutes).slice(-2)}` + secondsEnd;
			let complStartDate = studyDate ? new Date(studyDate.year, studyDate.month, studyDate.day, timeStart.hours, timeStart.minutes, timeStart.seconds) : -1;
			let complEndDate = studyDate ? new Date(studyDate.year, studyDate.month, studyDate.day, timeEnd.hours, timeEnd.minutes, timeEnd.seconds) : -1;

			if (xStart == '00:00:00' && !xlabels.includes('00:00:00')) {
				xStart = xlabels[0];
			}

			if (xEnd == '00:00:00' && !xlabels.includes('00:00:00')) {
				xEnd = xlabels[0];
			}
			if (!(complStartDate >= sStartDate) || !(complStartDate <= sEndDate)) {
				xStart = sStartTime;
			}
			if (!(complEndDate >= sStartDate) || !(complStartDate <= sEndDate)) {
				xEnd = sEndTime;
			}
			if (complStartDate !== -1 && complEndDate !== -1) {
				dataTimes.push(
					{
						x: xStart,
						y: yCount,
						num: xStart == '00:00:00' && -1,
					},
					{
						x: xEnd,
						y: yCount,
						num: xEnd == '00:00:00' && -1,
					},
					{
						x: NaN,
						y: yCount,
						num: 0,
					}
				);
			}
		}
		if (dataTimes.length > 0) yCount++;
		return dataTimes;
	};

	let studyDataTimes = createDataPoints(data.sessionInfo.studyTimes, 1);

	let sBreakTimes = createDataPoints(data.sessionInfo.shortBreakTimes, 2);

	let lBreakTimes = createDataPoints(data.sessionInfo.longBreakTimes, 3);

	const createTaskPoints = (taskType, val) => {
		let tasks = [];
		for (let i = 0; i <= taskType.length - 1; i++) {
			let timeDis = taskType[i]['time' + val];
			let taskDate = taskType[i]['date' + val];
			let complDate = taskDate ? new Date(taskDate.year, taskDate.month, taskDate.day, timeDis.hours, timeDis.minutes, timeDis.seconds) : -1;
			let seconds = timeDif < 60000 && timeDis ? ':' + ('0' + timeDis.seconds).slice(-2) : '';

			if (complDate !== -1 && complDate >= sStartDate && complDate <= sEndDate && timeDis) {
				tasks.push({
					x: `${('0' + timeDis.hours).slice(-2)}:${('0' + timeDis.minutes).slice(-2)}` + seconds,
					y: yCount,
				});
			}
		}
		if (tasks.length > 0) yCount++;
		return tasks;
	};

	let tasksStarted = createTaskPoints(totalTasks, '', 4);
	let tasksFinished = createTaskPoints(totalTasks, 'Finished', 4);
	let tasksReopened = createTaskPoints(totalTasks, 'Reopened', 4);
	let dataSet = [];

	if (studyDataTimes.length > 0)
		dataSet.push({
			label: ' Study Time ',
			backgroundColor: '#8eb798',
			borderColor: '#498551',
			data: studyDataTimes,
		});

	if (lBreakTimes.length > 0)
		dataSet.push({
			type: 'line',
			label: ' Long Break ',
			backgroundColor: '#c7b5df',
			borderColor: '#763ea8',
			data: lBreakTimes,
		});

	if (sBreakTimes.length > 0)
		dataSet.push({
			label: ' Short Break ',
			backgroundColor: 'rgba(75,192,192,1)',
			borderColor: '#5599c5',
			data: sBreakTimes,
		});

	if (tasksReopened.length > 0)
		dataSet.push({
			type: 'scatter',
			label: ' Task Reopened ',
			backgroundColor: '#0166a8',
			borderColor: '#151848',
			data: tasksReopened,
		});

	if (tasksFinished.length > 0)
		dataSet.push({
			type: 'scatter',
			label: ' Task Finished ',
			backgroundColor: '#e83e30',
			borderColor: '#9c1120',
			data: tasksFinished,
		});

	if (tasksStarted.length > 0)
		dataSet.push({
			type: 'scatter',
			label: ' Tasks Started ',
			backgroundColor: '#68b349',
			borderColor: '#025409',
			data: tasksStarted,
		});

	const state = {
		labels: xlabels,
		datasets: dataSet,
	};

	return (
		<div className='chart-container'>
			<Line
				data={state}
				options={{
					plugins: {
						legend: {
							position: 'top',
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
								beginAtZero: true,
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
