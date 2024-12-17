"use strict";

const { SMTP_CONFIGURATIONS } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM 
            public.${SMTP_CONFIGURATIONS}
        WHERE
            usermane = 'it.support@genus.in';
        
        INSERT INTO
          public.${SMTP_CONFIGURATIONS} (
            id,
            server,
            port,
            encryption,
            usermane,
            password,
            salt,
            is_active,
            created_by,
            updated_by,
            created_at,
            updated_at
          )
        VALUES
          (
            'da4c7113-f687-49c1-aa37-be413727456e',
            'smtp.gmail.com',
            587,
            'TLS',
            'it.support@genus.in',
            '18c056bcc01db024b7ffdbcb7f0e678e68c30370e25edff8d484230532d0977b',
            'f9da1fa5f0ad61126918f3f91cc9961b',
            '1',
            '577b8900-b333-42d0-b7fb-347abc3f0b5c',
            '577b8900-b333-42d0-b7fb-347abc3f0b5c',
            '2024-02-15 11:26:25.613+05:30',
            '2024-02-15 16:25:39.381424+05:30'
          );`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `DELETE FROM  public.${SMTP_CONFIGURATIONS} WHERE id = 'da4c7113-f687-49c1-aa37-be413727456e'`
        );
    }
};
