export function convertMilli(milli, choice) {
	switch (choice) {
		case 'hour':
			return Math.floor((milli / (1000 * 60 * 60)) % 24);
		case 'min':
			return Math.floor((milli / 60000) % 60);
		case 'sec':
			return Math.floor((milli / 1000) % 60);
		default:
			return milli * 60000;
	}
}
