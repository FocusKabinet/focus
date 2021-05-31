export const studyDataType = {
	ADD_BREAK: 'ADD_BREAK', //when a break is taken
	ADD_STUDY: 'ADD_STUDY', //when a study is started
	ADD_SESSION: 'ADD_SESSION', //when a study is ended
	ADD_STUDY_ATTEMPTED: 'ADD_STUDY_ATTEMPTED', //number of studies attempted
	CLEAR_STATE: 'CLEAR_STATE',
};

export const StudyActionCreators = {
	addBreak: (times, type) => ({
		type: 'BREAK_START',
		payload: { times, type },
	}),

	addStudy: (times) => ({
		type: 'ADD_STUDY',
		payload: { times },
	}),

	addSession: (times) => ({
		type: 'ADD_SESSION',
		payload: { times },
	}),

	addStudyAttempt: (num) => ({
		type: 'ADD_STUDY_ATTEMPTED',
		payload: num,
	}),

	clearState: () => ({
		type: 'CLEAR_STATE',
	}),
};
