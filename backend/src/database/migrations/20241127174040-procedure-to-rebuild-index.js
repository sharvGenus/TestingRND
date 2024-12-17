"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
              CREATE
          OR REPLACE PROCEDURE REBUILD_BLOATED_INDEXES (THRESHOLD NUMERIC DEFAULT 1.1) LANGUAGE PLPGSQL AS $$
          DECLARE
              tbl RECORD;
              idx RECORD;
              idx_bloat NUMERIC;
          BEGIN
              -- Loop through all tables in the current schema
              FOR tbl IN
                  SELECT schemaname, relname AS tablename
                  FROM pg_stat_user_tables
              LOOP
                  RAISE NOTICE 'Processing table: %.%', tbl.schemaname, tbl.tablename;

                  -- Loop through all indexes for the current table
                  FOR idx IN
                      SELECT 
                          i.indexrelid::regclass AS index_name,
                          pg_stat_get_numscans(i.indexrelid) AS num_scans,
                          (pg_relation_size(i.indexrelid) / NULLIF(pg_relation_size(c.oid), 0)) AS index_bloat_ratio
                      FROM 
                          pg_index i
                      JOIN 
                          pg_class c ON c.oid = i.indrelid
                      WHERE 
                          c.relname = tbl.tablename
                  LOOP
                      idx_bloat := idx.index_bloat_ratio;

                      -- Check if the index bloat ratio exceeds the threshold
                      IF idx_bloat IS NOT NULL AND idx_bloat > threshold THEN
                          RAISE NOTICE 'Rebuilding index: % (bloat ratio: %)', idx.index_name, idx_bloat;

                          -- Rebuild the index
                          EXECUTE FORMAT('REINDEX INDEX %I;', idx.index_name);
                      ELSE
                          RAISE NOTICE 'Index % does not require rebuilding (bloat ratio: %)', idx.index_name, COALESCE(idx_bloat::TEXT, 'N/A');
                      END IF;
                  END LOOP;
              END LOOP;

              RAISE NOTICE 'Index rebuilding process completed.';
          END;
          $$;
          `);
    },

    async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    }
};
