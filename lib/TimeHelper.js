function getTime(timeData) {
	hour = timeData.getHours();
	minute = timeData.getMinutes();
	output = '';
	period = null;

	if (hour > 12) {
		output += hour - 12;
		period = 'pm';
	} else if (hour == 0) {
		output += 12;
		period = 'am';
	} else {
		output += hour;
		period = 'am';
	}

	output += ':';
	
	if (minute.toString().length == 1) {
		output += '0' + minute;
	} else {
		output += minute;
	}

	output += period;
	return output;
}

function getDayOfWeek(timeData) {
	week = timeData.getDay();
	weekData = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
		]
	return weekData[week]	
}

function getDate(timeData) {
	return getDayOfWeek(timeData) + ', ' + timeData.getMonth() + '/' + timeData.getDate();
}

function getFullDate(timeData) {
	return getDate(timeData) +  ' at ' + getTime(timeData);
}

function getMorningSmart() {
	return getGeneralSmart(11);
}

function getAfternoonSmart() {
	return getGeneralSmart(14);
}

function getEveningSmart() {
	return getGeneralSmart(17);
}

function getGeneralSmart(time) {
	timeData = new Date();
	timeData.setMinutes(0);
	if (timeData.getHours() >= time) {
		timeData.setHours(time + 24);
	} else {
		timeData.setHours(time);
	}
	return timeData;
}

export { getTime, getDate, getDayOfWeek, getFullDate, getMorningSmart, getAfternoonSmart, getEveningSmart }