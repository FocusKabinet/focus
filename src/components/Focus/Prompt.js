import { useState, useEffect } from 'react';

const initBeforeUnLoad = (showExitPrompt) => {
	window.onbeforeunload = (event) => {
		// Show prompt based on state
		if (showExitPrompt) {
			const e = event || window.event;
			e.preventDefault();
			if (e) {
				e.returnValue = 'Leaving this page will end the session';
			}
			return 'Leaving this page will end the session';
		}
	};
};

function LeavePrompt(bool) {
	const [showExitPrompt, setShowExitPrompt] = useState(bool);

	window.onload = function () {
		initBeforeUnLoad(showExitPrompt);
	};
	useEffect(() => {
		initBeforeUnLoad(showExitPrompt);
	}, [showExitPrompt]);

	return [showExitPrompt, setShowExitPrompt];
}

export default LeavePrompt;
