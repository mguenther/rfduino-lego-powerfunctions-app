// route all console logs to Evothings studio log
if (window.hyper) {
    console.log = hyper.log;
}

/**
 * Represents the delay in milliseconds between two consecutive updates
 * (this will send 2 packets a 2 byte) to the RFduino. A delay of 200 ms
 * still seems quite responsive.
 *
 * @type {number}
 */
var DELAY_BETWEEN_RFDUINO_UPDATES = 200;

/**
 * This is our application context. It holds functions and state, such as
 * an instance of the connection abstraction (cf. <code>js/rfduino.js</code>)
 * and the protocol implementation (cf. <code>js/protocol.js</code>).
 *
 * @type {{}}
 */
var app = {};

/**
 * Sets the value of a status label to the given <code>message</code>.
 *
 * @param message
 *      status info on the RFduino connection
 */
app.updateStatus = function(message) {
    document.getElementById("info").innerHTML = message;
};

/**
 * Tries to establish a connection to the RFduino.
 */
app.connect = function() {
    app.channel = new Channel(app.updateStatus);
    app.protocol = new Protocol();
};

/**
 * Reads the current state of the thumb stick and updates the application context
 * accordingly. If the thumb stick is not active any longer (the user released
 * the thumb stick) the position vector is reset to (0, 0) which stops the
 * vehicle and moves its axis to neutral position.
 */
app.updatePosition = function() {

    var val = app.thumbStick.stick;

    if (val.active) {
        var controlX = Math.round(-((val.length*val.normal.x)/val.maxLength)*127);
        var controlY = Math.round(-((val.length*val.normal.y)/val.maxLength)*127);
        app.controlX = controlX;
        app.controlY = controlY;
    } else {
        app.controlX = 0;
        app.controlY = 0;
    }
};

/**
 * Gets called periodically, every <code>DELAY_BETWEEN_RFDUINO_UPDATES</code> ms.
 * This sends the respective commands to the RFduino, based on the positional data
 * obtained from the thumb stick.
 */
app.sendPeriodically = function() {

    if (app.controlX === undefined || app.controlY === undefined ||
        app.protocol === undefined || app.channel === undefined) {
        return;
    }

    if (app.controlX === 0 && app.controlY === 0) {
        app.protocol.center(app.channel);
        app.protocol.brake(app.channel);
        return;
    }

    if (app.controlY !== undefined) {
        if (app.controlY > 20) {
            app.protocol.accelerate(app.channel, 7);
        } else if (app.controlY < -20) {
            app.protocol.reverseAccelerate(app.channel, 7);
        }
    }
    if (app.controlX !== undefined) {
		if (app.controlX < 40 && app.controlX > -40) {
			app.protocol.center(app.channel, 7);
		} else if (app.controlX < 40) {
            app.protocol.steerRight(app.channel, 7);
        } else if (app.controlX > -40) {
            app.protocol.steerLeft(app.channel, 7);
        }
    }
};

/**
 * Callback for Cordova. Gets called upon event 'deviceready' and initializes the
 * application.
 */
app.onDeviceReady = function() {

    app.updateStatus("Press button to connect...");

    var thumbStick = new ThumbStick('stage');
    thumbStick.init();
    thumbStick.onUpdate = app.updatePosition;

    app.thumbStick = thumbStick;

    $(window).resize(app.thumbStick.onResizeCanvas.bind(app.thumbStick));

    app.interval = setInterval(function() { app.sendPeriodically(); }, DELAY_BETWEEN_RFDUINO_UPDATES);
}

// entry point for cordova; this gets called as soon as the device is ready
document.addEventListener('deviceready', function() { app.onDeviceReady(); }, false);