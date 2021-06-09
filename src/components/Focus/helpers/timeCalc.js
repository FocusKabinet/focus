import { convertMilli } from './convertMilli';

export function timeCalc(sH, sM, sS, eH, eM, eS, choice) {
	switch (choice) {
		case 'add':
			let startMilli =
				convertMilli(sH, 'hourM') +
				convertMilli(sM, 'minM') +
				convertMilli(sS, 'secM');
			let endMilli =
				convertMilli(eH, 'hourM') +
				convertMilli(eM, 'minM') +
				convertMilli(eS, 'secM');
			let timeDiff = endMilli - startMilli;
			return {
				hour: convertMilli(timeDiff, 'hour'),
				min: convertMilli(timeDiff, 'min'),
				sec: convertMilli(timeDiff, 'sec'),
			};
		default:
			return 0;
	}
}
