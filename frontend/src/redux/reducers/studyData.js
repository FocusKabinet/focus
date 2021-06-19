import { studyDataType as Types } from '../actions/studyData';

const initialState = {
	studies: 0,
	study_times: [],
	short_breaks_taken: 0,
	long_breaks_taken: 0,
	short_breaks: [],
	long_breaks: [],
	session_times: [],
	sessions: 0,
};

const studyReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.ADD_SHORT_BREAK:
			return {
				...state,
				short_breaks_taken: state.short_breaks_taken + 1,
				short_breaks: [...state.short_breaks, action.payload.time],
			};
		case Types.ADD_LONG_BREAK:	
				return {
					...state,
					long_breaks_taken: state.long_breaks_taken + 1,
					long_breaks: [...state.long_breaks, action.payload.time],
				};
		case Types.ADD_STUDY:
			return {
				...state,
				studies: state.studies + 1,
				study_times: [...state.study_times, action.payload.times],
			};
		case Types.ADD_SESSION:
			return {
				...state,
				sessions: state.sessions + 1,
				session_times: [...state.session_times, action.payload.times],
			};
		case Types.CLEAR_STATE:
			return initialState;
		default:
			return state;
	}
};

export default studyReducer;
