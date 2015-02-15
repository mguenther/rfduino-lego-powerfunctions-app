/**
 * The LEGO Power Functions controller and motor has seven steps when
 * controlling motor speed or vehicle orientation. Steps are 1-based,
 * so values must be in range [1; 7] to be admissible. This constant
 * represents the lower boundary.
 *
 * @type {number}
 */
var PARAMETER_MINIMUM_VALUE = 1;

/**
 * The LEGO Power Functions controller and motor has seven steps when
 * controlling motor speed or vehicle orientation. Steps are 1-based,
 * so values must be in range [1; 7] to be admissible. This constant
 * represents the upper boundary.
 *
 * @type {number}
 */
var PARAMETER_MAXIMUM_VALUE = 7;

var OPCODE_STEER_LEFT = 0x01;
var OPCODE_STEER_RIGHT = 0x02;
var OPCODE_NEUTRAL = 0x03;
var OPCODE_ACCELERATE = 0x04;
var OPCODE_REVERSE_ACCELERATE = 0x05;
var OPCODE_BRAKE = 0x06;

var EMPTY_PAYLOAD = 0x00;

var Protocol = function() {
};

function isInRange(value) {
    return value >= PARAMETER_MINIMUM_VALUE && value <= PARAMETER_MAXIMUM_VALUE;
}

/**
 * Dispatches a 'steer left' command to the RFduino. The parameter
 * extent determines to which degree the vehicle will adjust its
 * axis to the left.
 *
 * If the given extent is outside of the range of admissible values,
 * this method will abort execution by throwing an Error. In this case,
 * no command will be sent to the RFduino.
 *
 * @param channel
 *      established channel over which to communicate with the RFduino
 * @param extent
 *      integer in the admissible range of [1; 7]
 */
Protocol.prototype.steerLeft = function(channel, extent) {
    if (!isInRange(extent)) {
        throw new Error('illegal argument: extent must be in range [1; 7].');
    }
    if (channel.isConnected()) {
        var cmd = new Uint8Array([OPCODE_STEER_LEFT, extent]);
        channel.send(cmd);
    }
};

/**
 * Dispatches a 'steer right' command to the RFduino. The parameter
 * extent determines to which degree the vehicle will adjust its
 * axis to the right.
 *
 * If the given extent is outside of the range of admissible values,
 * this method will abort execution by throwing an Error. In this case,
 * no command will be sent to the RFduino.
 *
 * @param channel
 *      established channel over which to communicate with the RFduino
 * @param extent
 *      integer in the admissible range of [1; 7]
 */

Protocol.prototype.steerRight = function(channel, extent) {
    if (!isInRange(extent)) {
        throw new Error('illegal argument: extent must be in range [1; 7].');
    }

    if (channel.isConnected()) {
        var cmd = new Uint8Array([OPCODE_STEER_RIGHT, extent]);
        channel.send(cmd);
    }
};

/**
 * Dispatches a 'center vehicle' command to the RFduino, which will
 * adjust the axis of the vehicle to their neutral position.
 *
 * @param channel
 *      established channel over which to communicate with the RFduino
 */
Protocol.prototype.center = function(channel) {
    if (channel.isConnected()) {
        var cmd = new Uint8Array([OPCODE_NEUTRAL, EMPTY_PAYLOAD]);
        channel.send(cmd);
    }
};

/**
 * Dispatches an 'accelerate vehicle' command to the RFduino. The
 * parameter velocity determines the target speed.
 *
 * If the given velocity is outside of the range of admissible values,
 * this method will abort execution by throwing an Error. In this case,
 * no command will be sent to the RFduino.
 *
 * @param channel
 *      established channel over which to communicate with the RFduino
 * @param velocity
 *      integer in the admissible range of [1; 7]
 */
Protocol.prototype.accelerate = function(channel, velocity) {
    if (!isInRange(velocity)) {
        throw new Error('illegal argument: velocity must be in range [1; 7].');
    }

    if (channel.isConnected()) {
        var cmd = new Uint8Array([OPCODE_ACCELERATE, velocity]);
        channel.send(cmd);
    }
};

/**
 * Dispatches a 'reverse accelerate vehicle' command to the RFduino.
 * The parameter velocity determines the target speed.
 *
 * If the given velocity is outside of the range of admissible values,
 * this method will abort execution by throwing an Error. In this case,
 * no command will be sent to the RFduino.
 *
 * @param channel
 *      established channel over which to communicate with the RFduino
 * @param velocity
 *      integer in the admissible range of [1; 7]
 */
Protocol.prototype.reverseAccelerate = function(channel, velocity) {
    if (!isInRange(velocity)) {
        throw new Error('illegal argument: velocity must be in range [1; 7].');
    }

    if (channel.isConnected()) {
        var cmd = new Uint8Array([OPCODE_REVERSE_ACCELERATE, velocity]);
        channel.send(cmd);
    }
};

/**
 * Dispatches a 'brake' command to the RFduino, which will stop the
 * vehicle.
 *
 * @param channel
 *      established channel over which to communicate with the RFduino
 */
Protocol.prototype.brake = function(channel) {
    if (channel.isConnected()) {
        var cmd = new Uint8Array([OPCODE_BRAKE, EMPTY_PAYLOAD]);
        channel.send(cmd);
    }
};