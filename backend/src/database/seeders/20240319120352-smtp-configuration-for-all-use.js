"use strict";

const { SMTP_CONFIGURATIONS, EMAIL_TEMPLATES } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            -- Update existing SMTP configuration for ess@genus.in to admin@genus.in, this will keep the same ID
            UPDATE public.${SMTP_CONFIGURATIONS}
            SET 
                usermane = 'admin@genus.in',
                server = 'smtp.gmail.com',
                port = 587,
                encryption = 'TLS',
                password = 'db4e55f6af6498c9d3856318ffc13c8c107ff3ce77359e619ab8eef126257a38',
                salt = '858155305cdbe92760f11719e703749d',
                is_active = '1',
                updated_by = '577b8900-b333-42d0-b7fb-347abc3f0b5c',
                updated_at = '2024-03-19 16:25:39.381424+05:30'
            WHERE usermane = 'ess@genus.in';
            
            -- Insert new SMTP configuration for admin@genus.in if it does not exist
            INSERT INTO public.${SMTP_CONFIGURATIONS} (
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
            SELECT
                '6f96a417-5a89-4d5a-8e93-3736d675262c',
                'smtp.gmail.com',
                587,
                'TLS',
                'admin@genus.in',
                'db4e55f6af6498c9d3856318ffc13c8c107ff3ce77359e619ab8eef126257a38',
                '858155305cdbe92760f11719e703749d',
                '1',
                '577b8900-b333-42d0-b7fb-347abc3f0b5c',
                '577b8900-b333-42d0-b7fb-347abc3f0b5c',
                '2024-03-19 11:26:25.613+05:30',
                '2024-03-19 16:25:39.381424+05:30'
            WHERE NOT EXISTS (
                SELECT 1 FROM public.${SMTP_CONFIGURATIONS} WHERE usermane = 'admin@genus.in'
            );        

            -- Update the from address on Email Templates to admin@genus.in where it is ess@genus.in 
            UPDATE public.${EMAIL_TEMPLATES}
            SET "from" = 'admin@genus.in'
            WHERE "from" = 'ess@genus.in';
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            `
            UPDATE public.${EMAIL_TEMPLATES}
            SET "from" = 'ess@genus.in'
            WHERE "from" = 'admin@genus.in';

            DELETE FROM public.${SMTP_CONFIGURATIONS} WHERE usermane = 'admin@genus.in';
          `
        );
    }
};
