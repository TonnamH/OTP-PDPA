// server/routes/ropa.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all ROPA data fully nested (Bureau -> Dept -> Activities)
router.get('/', async (req, res) => {
  try {
    // This query uses Postgres JSON aggregation to reconstruct the exact shape of your original ropaData.json
    const query = `
      SELECT
        b.id AS "bureauId",
        b.name AS "bureauName",
        b.has_data AS "hasData",
        COALESCE(
          json_agg(
            json_build_object(
              'id', d.id,
              'name', d.name,
              'color', d.color,
              'activities', (
                SELECT COALESCE(json_agg(
                  json_build_object(
                    'id', a.id,
                    'name', a.name,
                    'dataController', a.data_controller,
                    'dpo', a.dpo,
                    'contactInfo', a.contact_info,
                    'formNameA1', a.form_name_a1,
                    'dataSourceA2', a.data_source_a2,
                    'generalData', a.general_data,
                    'sensitiveData', a.sensitive_data,
                    'lawfulBasis24', a.lawful_basis_24,
                    'lawfulBasis26', a.lawful_basis_26,
                    'purposeOfCollectionC1', a.purpose_of_collection_c1,
                    'dataUserC2', a.data_user_c2,
                    'collectionSourceC3', a.collection_source_c3,
                    'collectionMediumC4', a.collection_medium_c4,
                    'physicalStorageD1', a.physical_storage_d1,
                    'electronicStorageD2', a.electronic_storage_d2,
                    'internalUsageE1', a.internal_usage_e1,
                    'internalAccessE2', a.internal_access_e2,
                    'externalDisclosureF1', a.external_disclosure_f1,
                    'transferModeF2', a.transfer_mode_f2,
                    'retentionPeriodG1', a.retention_period_g1,
                    'disposalMethodG2', a.disposal_method_g2,
                    'technicalMeasuresH1', a.technical_measures_h1,
                    'organizationalMeasuresH2', a.organizational_measures_h2,
                    'activityStatusI1', a.activity_status_i1,
                    'lastUpdateI2', a.last_update_i2,
                    'revisionI3', a.revision_i3
                  )
                ), '[]'::json)
                FROM ropa_activities a
                WHERE a.department_id = d.id
              )
            )
          ) FILTER (WHERE d.id IS NOT NULL), '[]'::json
        ) AS "subDepartments"
      FROM ropa_bureaus b
      LEFT JOIN ropa_departments d ON b.id = d.bureau_id
      GROUP BY b.id, b.name, b.has_data;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ROPA data:', error);
    res.status(500).json({ error: 'Server error while fetching ROPA data' });
  }
});

module.exports = router;