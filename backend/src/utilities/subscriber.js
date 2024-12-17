const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

async function subscriber() {
    // Subscribe to a channel
    await redis.subscribe(global.eventNames.publisher);

    // Listen for messages
    redis.on('message', (channel, msg) => {
        if (channel === global.eventNames.publisher) {
            let _message = msg;
            try {
                _message = JSON.parse(msg)
            } catch (error) {
                console.log("error", error);
                _message = msg;
            }

            const { id, message, type } = _message;
            if (type === global.eventNames.sendSocketMessage) {
                if (id && global.webSocket[id]) {
                    global.webSocket[id].send(Object.prototype.toString.call(message) === "[object String]" ? message : JSON.stringify(message));
                }
            } else if (type === global.eventNames.closeConnection) {
                if (id && global.webSocket[id]) {
                    global.webSocket[id].close();
                }
            } else if (type === global.eventNames.dataImportStart) {
                global.dataImportStatus = message;
            } else if ([global.eventNames.dataImportEnd, global.eventNames.dataImportInProgress].includes(type)) {
                const connectKeys = Object.keys(global.webSocket).filter((x) => x.startsWith(id));
                connectKeys.forEach((key) => {
                    if (key && global.webSocket[key]) {
                        global.webSocket[key].send(
                            Object.prototype.toString.call(message)
                                === "[object String]"
                                ? message
                                : JSON.stringify(message)
                        );
                    }
                });
            }
        }
    });
}

module.exports = subscriber;