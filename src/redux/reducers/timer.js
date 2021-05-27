import { timerDataType as Types } from '../actions/timer';

const initialState = {
	deep_study: false,
	auto_start: false,
	auto_break: false,
	long: 10,
	short: 5,
	study: 24,
};

const timerReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.SET_TYPE:
			return {
				...state,
				deep_study: action.payload,
			};
		case Types.AUTO_START:
			return {
				...state,
				auto_start: action.payload,
			};
		case Types.AUTO_BREAK:
			return {
				...state,
				auto_break: action.payload,
			};
		case Types.SET_BREAK_TIME:
			if (action.payload.type) {
				return {
					...state,
					short: action.dur,
				};
			} else {
				return {
					...state,
					long: action.dur,
				};
			}
		case Types.SET_STUDY_TIME:
			return {
				...state,
				study: action.payload,
			};

		case Types.CLEAR_STATE:
			return initialState;
		default:
			return state;
	}
};

export default timerReducer;
