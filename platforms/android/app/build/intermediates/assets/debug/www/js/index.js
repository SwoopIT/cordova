
var app = {
	// Application Constructor
	initialize: function () {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},

	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady: function () {
		this.receivedEvent('deviceready');
		app.push = PushNotification.init({
			"android": {
				"senderID": "396697495271",
				"iconColor": "#1caeee"
			}
		});

		app.push.on('registration', function(data) {
			console.log("registration event: " + data.registrationId);
			var oldRegId = localStorage.getItem('registrationId');
			if (oldRegId !== data.registrationId) {
				// Save new registration ID
				localStorage.setItem('registrationId', data.registrationId);
				// Post registrationId to your app server as the value has changed
			}
			deviceId = data.registrationId;
			regDevice(data.registrationId, oldRegId);
		});
		app.push.on('notification', function(data) {
			console.log('notification event');
			M.toast({html: data.title + '\n' + data.message})
		});

		app.push.on('error', function(e) {
			console.log("push error = " + e.message);
		});
		isAvailable();
		userSettings.preferredPay = localStorage.getItem("preferredPay");
		if (!userSettings.preferedPay) {
			userSettings = {
				preferredPay: 2
			};
			localStorage.setItem('preferredPay', '2')
		}
	},

	// Update DOM on a Received Event
	receivedEvent: function (id) {

	}
};

app.initialize();