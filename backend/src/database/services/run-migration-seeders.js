/* eslint-disable no-proto */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

"use strict";

const path = require("path");
const osType = require("os").platform();
const { Umzug, SequelizeStorage } = require("umzug");
const Sequelize = require("sequelize");

global.isReadReplication = process.env.REPLICA_DB_HOST && process.env.REPLICA_DB_USER && process.env.REPLICA_DB_PASS && process.env.REPLICA_DB_PORT;

const getSequalizeIns = async () => {
    const pool = {
        min: process.env.SEQ_POOL_MAX || 0,
        max: process.env.SEQ_POOL_MAX || 70,
        idle: process.env.SEQ_POOL_IDLE || 10000,
        acquire: process.env.SEQ_POOL_IDLE || 300000
    };

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            dialect: process.env.DB_DIALECT,
            dialectOptions: {
                ssl: false
            },
            port: process.env.DB_PORT,
            ...(global.isReadReplication ? {
                replication: {
                    read: [
                        {
                            host: process.env.REPLICA_DB_HOST,
                            username: process.env.REPLICA_DB_USER,
                            password: process.env.REPLICA_DB_PASS,
                            port: process.env.REPLICA_DB_PORT
                        }
                    ],
                    write: {
                        host: process.env.DB_HOST,
                        username: process.env.DB_USER,
                        password: process.env.DB_PASS
                    }
                }
            } : { host: process.env.DB_HOST }),
            pool: pool,
            logging: false
        }
    );
    await sequelize.authenticate();

    // Override the query method using __proto__
    sequelize.__proto__.selectQuery = async function (sql, options = {}) {
        // Call the original query method with updating its type to use replicataion server
        const data = await sequelize.__proto__.query.call(sequelize, sql, {
            ...options,
            type: Sequelize.QueryTypes.SELECT,
            ...global.isReadReplication && { userMaster: false }
        });
        return [data];
    };

    return sequelize;
};

const runMigrationsAndSeeders = async () => {
    try {
        await runMigrations();
        await runSeeders();
    } catch (error) {
        console.log(">genus-wfm | [run-migration-seeders.js] | LINE #40 | error : ", error);
        throw error;
    }
};

const runMigrations = async function () {
    const { migratorConfig, sequelize } = await getMigratInstance();
    await migratorConfig.up();
    await sequelize.close();
};

const runSeeders = async function () {
    const { seederConfig, sequelize } = await getMigratInstance("seeders");
    await seederConfig.up();
    await sequelize.close();
};

const getMigratInstance = async function (folderName = "migrations") {
    let time = Date.now();
    const sequelize = await getSequalizeIns();
    const migrator = new Umzug({
        migrations: {
            glob: formatPath(path.resolve(__dirname, `../${folderName}/*.js`)),
            resolve: ({ name, path, context }) => {
                const migration = require(path);
                return {
                    name,
                    up: async () => migration.up(context, Sequelize),
                    down: async () => migration.down(context, Sequelize)
                };
            }
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize, modelName: folderName === "migrations" ? "system_migrations" : "system_seeders" })
    });
    migrator.on("migrating", ({ name }) => {
        time = Date.now();
        console.log(`== ${name}: ${folderName === "migrations" ? "migrating" : "seeding"} =======`);
    });
    migrator.on("migrated", ({ name }) => {
        console.log(`== ${name}: ${folderName === "migrations" ? "migrated" : "seeded"} (${(Date.now() - time) / 1000}s) \n`);
    });
    return { [folderName === "migrations" ? "migratorConfig" : "seederConfig"]: migrator, sequelize };
};

function formatPath(pathText) {
    if (pathText && osType === "win32") {
        return pathText.replace(/\\/g, "/");
    }
    return pathText;
}

module.exports = {
    runMigrationsAndSeeders,
    runMigrations,
    runSeeders,
    getSequalizeIns
};
