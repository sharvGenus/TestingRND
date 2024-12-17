const { getClient } = require("./redisClient");

function publishMessage(channel, message) {
    const client = getClient("client");
    const finalMessage = Object.prototype.toString(message) !== "[object String]" ? JSON.stringify(message) : message;
    client.publish(channel, finalMessage, (err) => {
        if (err) {
            console.error("Publish error:", err);
        }
    });
}

module.exports = publishMessage;
