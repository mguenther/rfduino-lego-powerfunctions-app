/**
 * The RFduino is exposed using the underneath device name. The
 * device name is hard-coded at the RFduino and in order to connect
 * to the device, the proper device name must be used. Please not
 * that if two devices share the same device name and are in range,
 * the device to which the client application connects to is
 * chosen non-deterministically.
 *
 * @type {string}
 */
var DEFAULT_DEVICE_NAME = "pfcontr";

/**
 * Indicates a disconnected state.
 *
 * @type {string}
 */
var STATUS_DISCONNECTED = "Disconnected";

/**
 * Indicates a transient state between disconnected and connected.
 *
 * @type {string}
 */
var STATUS_CONNECTING = "Connecting...";

/**
 * Indicates a connected state.
 *
 * @type {string}
 */
var STATUS_CONNECTED = "Connected";

/**
 * Establishes a communication path to the RFduino identified
 * by <code>DEFAULT_DEVICE_NAME</code> (device names are not
 * configurable with this implementation). Exposes a minimalistic
 * API to send byte arrays as protocol data to the RFduino.
 *
 * This implementation does not detect connection losses.
 *
 * @param channelListener
 *      This is a callback function that will be invoked
 *      whenever this <code>Channel</code> changes its
 *      connection state (see constants <code>STATUS_CONNECTED</code>
 *      and <code>STATUS_DISCONNECTED</code>.
 * @constructor
 *      Consumes a channel listener callback function
 */
var Channel = function(channelListener) {

    var self = this;

    self.channelListener = channelListener;
    self.connection = null;

    /**
     * Sends data in form of a byte array to the RFduino.
     *
     * @param data
     *      byte array of arbitrary size which holds protocol
     *      data
     */
    self.send = function(data) {
        self.connection && self.connection.writeDataArray(data);
    };

    /**
     * Yields the connection status. This is somewhat flaky,
     * since there is no indication if a connection was lost
     * at the moment.
     *
     * @returns {boolean}
     *      whether the RFduino is connected
     */
    self.isConnected = function() {
        return self.connection !== null;
    };

    /**
     * Disconnects the client application from the RFduino.
     */
    self.closeConnection = function() {
        evothings.rfduinoble.close();
        self.channelListener(STATUS_DISCONNECTED);
    };

    function connect() {

        self.closeConnection();
        self.channelListener(STATUS_CONNECTING);

        setTimeout(function() {
            evothings.rfduinoble.connect(
                DEFAULT_DEVICE_NAME,
                function(connection) {
                    self.connection = connection;
                    self.channelListener(STATUS_CONNECTED);
                },
                function(errorCode) {
                    self.channelListener(STATUS_DISCONNECTED + ": " + errorCode);
                }
            );
        }, 500);
    };

    connect();
};