apikey = 'redacted'

function start() {
	gapi.client.init({
		'apikey': apikey,
	}).then(function() {
		var timestamp = (new Date()).toISOString();
		return gapi.client.request({
			'path': 'https://www.googleapis.com/calendar/v3/calendars/nod789fge1kv6i6ip1b000pv8k%40group.calendar.google.com/events?singleEvents=True&timeMin='+timestamp+'&orderBy=startTime'+'&key='+apikey
		});
	}).then(function(response) {
		var respjson = response.result;
		var now = Date.now();

		var currTime = new Date()
		var startTime = new Date(currTime.getTime());
		startTime.setHours('10');
		startTime.setMinutes('00');
		startTime.setSeconds('00');

		var endTime = new Date(currTime.getTime());
		endTime.setHours('18');
		endTime.setMinutes('00');
		endTime.setSeconds('00');

		var billEventName = respjson['items'][0]['summary'];
		if (billEventName.includes("Bill Miller") && currTime >= startTime && currTime <= endTime) {
			document.getElementById("billHere").innerHTML = "IN";
			document.getElementById("billHere").classList.remove('badge-danger');
			document.getElementById("billHere").classList.add('badge-success');
		} else {
			document.getElementById("billHere").innerHTML = "OUT";
			document.getElementById("billHere").classList.remove('badge-success');
			document.getElementById("billHere").classList.add('badge-danger');
		}


		for(i=0; i < respjson['items'].length; i++) {
			var eventName = respjson['items'][i]['summary'];
			var eventStart = Date.parse(respjson['items'][i]['start']['dateTime']);
			var eventEnd = Date.parse(respjson['items'][i]['end']['dateTime']);
			if(isNaN(eventEnd - eventStart) || eventEnd - eventStart > (12*60*60*1000)) {
				// event is longer than 12 hours, skip
				continue;
			} else if (now > eventStart && now < eventEnd) {
				document.getElementById("currEvent").innerHTML = eventName;
				break;
			} else {
				document.getElementById("currEvent").innerHTML = "N/A";
				break;
			}
		}

	}, function(reason) {
		console.log("ERROR: " + reason.result.error.message);
	});
};

gapi.load('client', start);

var calCheck = setInterval(function() {
	gapi.load('client', start);
}, 5*60*1000);

setTimeout(function() {
	location.reload();
}, 6*60*60*1000);
