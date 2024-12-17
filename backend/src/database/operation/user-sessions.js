const { v4 } = require("uuid");
const { USERS, UESR_SESSOINS } = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for users table
 *
 * created by               version                         date
 * Harish                    1.0.0                          19 June 2023
 *
 * @class Roles
 */
class UserSessoins extends Base {

    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = UESR_SESSOINS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            userId: "user_id",
            lastActiveAt: "last_active_at",
            userAgent: "userAgent",
            loggedInUsingOTP: "logged_in_using_otp",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[USERS],
                attributes: ["id", "name"]
            }
        ];
    }

    async create(data) {
        const id = v4();
        await this.redisDb.set(`session_${id}_${data.userId}`, data, data.loggedInUsingOTP ? undefined : 30 * 60);
        return { id, ...data };
    }

    async findOne({ id, userId }) {
        const data = await this.redisDb.getObject(`session_${id}_${userId}`);
        return data ? { ...data, id } : undefined;
    }

    async update(data, { id }) {
        data.lastActiveAt = Date.now();
        await this.redisDb.set(`session_${id}_${data.userId}`, data, data.loggedInUsingOTP ? undefined : 30 * 60);
        return { id, ...data };
    }

    async forceDelete({ id, userId }) {
        if (!id) {
            const allAvailableInRedis = await this.redisDb.scan(`session_*_${userId}`);
            return Promise.all(allAvailableInRedis.map(async (item) => {
                if (userId === "*" || item.include(userId)) return this.redisDb.del(item);
            }));
        }
        return this.redisDb.del(id);
    }
}

module.exports = UserSessoins;
