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

function getDate(timeData) {
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
	return weekData[week] + ', ' + timeData.getMonth() + '/' + timeData.getDate();
}

function getFullDate(timeData) {
	return getDate(timeData) +  ' at ' + getTime(timeData);
}

export { getTime, getDate, getFullDate }