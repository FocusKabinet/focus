export const timerDataType = {
	SET_TYPE: 'SET_TYPE',
	AUTO_BREAK: 'AUTO_BREAK',
	AUTO_START: 'AUTO_START',
	SET_BREAK_TIME: 'SET_BREAK_TIME',
	SET_STUDY_TIME: 'SET_STUDY_TIME',
	CLEAR_STATE: 'CLEAR_STATE',
};

export const TimerActionCreators = {
	setType: (type) => ({
		type: 'SET_TYPE',
		payload: type,
	}),

	setAutoBreak: (autoBreak) => ({
		type: 'AUTO_BREAK',
		payload: autoBreak,
	}),

	setAutoStart: (autoStart) => ({
		type: 'AUTO_START',
		payload: autoStart,
	}),

	setBreakTime: (type, dur) => ({
		type: 'SET_BREAK_TIME',
		payload: { type, dur },
	}),

	setStudyTime: (dur) => ({
		type: 'SET_STUDY_TIME',
		payload: dur,
	}),

	clearState: () => ({
		type: 'CLEAR_STATE',
	}),
};
