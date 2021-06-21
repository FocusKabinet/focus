export const studyDataType = {
	ADD_LONG_BREAK: 'ADD_LONG_BREAK', //when a long break is taken
	ADD_SHORT_BREAK: 'ADD_SHORT_BREAK', //when a long break is taken
	ADD_STUDY: 'ADD_STUDY', //when a study is started
	ADD_SESSION: 'ADD_SESSION', //when a study is ended
	CLEAR_STATE: 'CLEAR_STATE',
};

export const StudyActionCreators = {
	addLBreak: (times) => ({
		type: 'ADD_LONG_BREAK',
		payload: { times },
	}),

	addSBreak: (times) => ({
		type: 'ADD_SHORT_BREAK',
		payload: { times },
	}),

	addStudy: (times) => ({
		type: 'ADD_STUDY',
		payload: { times },
	}),

	addSession: (times) => ({
		type: 'ADD_SESSION',
		payload: { times },
	}),

	clearState: () => ({
		type: 'CLEAR_STATE',
	}),
};
