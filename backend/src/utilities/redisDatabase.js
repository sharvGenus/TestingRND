"use strict";

const { getClient } = require("./redisClient");

/**
 * This is a class that represents a simple `Redis Database`.
 */

class RedisDatabase {
    constructor() {
        // connect redis client to initialise
        this.client = getClient("client");
    }

    /**
	 * function to check if any key is exist in redis
	 * @param {*} field : key of any object
	 * @returns promise
	 */
    async isExists(field) {
        return this.client.exists(field);
    }

    /**
	 * function to get object from redis
	 * @param {*} field : key of any object
	 * @returns promise
	 */
    async getObject(key) {
        const val = await this.client.get(key);
        return val ? JSON.parse(val) : null;
    }

    /**
	 * function to set value in redis
	 * @param {*} key : key of any object
	 * @param {*} message : data or message which has to be stored in redis
	 * @param {*} expire expiry time in seconds
	 * @returns promise
	 */
    async set(key, message, expiry) {
        let data = message;
        if (Object.prototype.toString(message) === "[object Object]") {
            data = JSON.stringify(message);
        }
        if (expiry) {
            return this.client.setex(key, expiry, data);
        }
        return this.client.set(key, data);
    }

    /**
	 * function to get value from redis
	 * @param {*} field : key of any object
	 * @returns promise
	 */
    async get(key) {
        return this.client.get(key);
    }

    /**
	 * function to delete object from redis
	 * @param {*} field : key of any object
	 * @returns promise
	 */
    async del(key) {
        return this.client.del(key);
    }

    /**
	 * function to scan all exist key in redis
	 * @returns promise
	 */
    async scan(mathcPattern = "*") {
        return this.client.keys(mathcPattern);
    }
}

module.exports = RedisDatabase;
