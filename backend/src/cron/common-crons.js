const scheduler = require("node-schedule");
const UserSessoins = require("../database/operation/user-sessions");
const User = require("../database/operation/users");

module.exports = () => {
    const scheulerTime = process.env.COMMON_SCHEULER_TIME || "1 0 */1 * *";
    scheduler.scheduleJob(scheulerTime, () => {
        const sessions = new UserSessoins();
        sessions.forceDelete({ userId: "*" });

        const user = new User();
        user.lockInaciveUsers();
    });

    // SCHEDULER TO CALL REBUILD INDEXES PROCEDURE
    scheduler.scheduleJob("1 0 * * SUN", () => {
        const { db } = new UserSessoins();
        db.sequelize.query("CALL REBUILD_BLOATED_INDEXES() ");
    });
};