function getIdIndex(listData, id) {
	if (listData == null) {
		return null;		
	}
	for (i = 0 ; i < listData.length ; i++) {
		if (listData[i].id == id) {
			return i;
		}
	}
	return null;
}

function generateSuggestionData(data) {
	if (data == null) {
		return null;
	}

	output = data.caption;

    for (i = data.tags.length - 1 ; i >= 0 ; i--) {
      position = data.tags[i].position;
      if (data.tags[i].suggestion != undefined) {
        output = [output.slice(0, position), data.tags[i].suggestion, output.slice(position)].join('');
      } else {
        output = [output.slice(0, position), '[' + data.tags[i].name + ']', output.slice(position)].join('');
      }
    }
    return output;
}

function generateTagData(data) {
	if (data == null) {
		return null;
	}

	output = data.caption;

    for (i = data.tags.length - 1 ; i >= 0 ; i--) {
      	position = data.tags[i].position;
    	output = [output.slice(0, position), '[' + data.tags[i].name + ']', output.slice(position)].join('');
    }
    return output;	
}

function createLongData(data){
	if (data == null) {
		return null;
	}
	if (data.tags.length == 0) {
		return data.caption;
	}

	holder = 0;
	output = [];
	
	for(i = 0 ; i < data.tags.length ; i++) {
		output.push(data.caption.substring(holder, data.tags[i].position));
		if (data.tags[i].suggestion != null) {
			output.push(data.tags[i].suggestion);
		} else {
			output.push('[' + data.tags[i].name+ ']');
		}
		holder = data.tags[i].position;
	}
	output.push(data.caption.substring(holder,data.caption.length));
	return output;
}
export { getIdIndex, generateSuggestionData, generateTagData, createLongData }