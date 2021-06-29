export const studyDataType = {
	ADD_LONG_BREAK: 'ADD_LONG_BREAK',
	DEL_LONG_BREAK: 'DEL_LONG_BREAK',
	ADD_SHORT_BREAK: 'ADD_SHORT_BREAK',
	DEL_SHORT_BREAK: 'DEL_SHORT_BREAK',
	ADD_STUDY: 'ADD_STUDY',
	DEL_STUDY: 'DEL_STUDY',
	ADD_SESSION: 'ADD_SESSION',
	DEL_SESSION: 'DEL_SESSION',
	CLEAR_SESSIONS: 'CLEAR_SESSIONS',
	CLEAR_STATE: 'CLEAR_STATE',
};

export const StudyActionCreators = {
	addLBreak: (times) => ({
		type: 'ADD_LONG_BREAK',
		payload: { times },
	}),

	delLBreak: (id) => ({
		type: 'DEL_LONG_BREAK',
		payload: id,
	}),

	addSBreak: (times) => ({
		type: 'ADD_SHORT_BREAK',
		payload: { times },
	}),

	delSBreak: (id) => ({
		type: 'DEL_SHORT_BREAK',
		payload: id,
	}),

	addStudy: (times) => ({
		type: 'ADD_STUDY',
		payload: { times },
	}),

	delStudy: (id) => ({
		type: 'DEL_STUDY',
		payload: id,
	}),

	addSession: (times) => ({
		type: 'ADD_SESSION',
		payload: { times },
	}),

	delSession: (id) => ({
		type: 'DEL_SESSION',
		payload: id,
	}),

	clrSessions: () => ({
		type: 'CLEAR_SESSIONS',
	}),

	clearState: () => ({
		type: 'CLEAR_STATE',
	}),
};
