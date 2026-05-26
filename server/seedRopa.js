// server/seedRopa.js
const fs = require('fs');
const path = require('path');
const pool = require('./db'); // Ensure this points to your Postgres connection pool

async function seedDatabase() {
  try {
    // 1. Point to the client folder where the JSON lives
    const dataPath = path.join(__dirname, '../client/src/data/ropaData.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const ropaData = JSON.parse(rawData);

    console.log('🌱 Starting to seed ROPA data...');

    // 2. Clear old data to prevent duplicates (Cascades down to departments and activities)
    await pool.query('TRUNCATE ropa_bureaus CASCADE');
    console.log('🗑️  Cleared existing tables.');

    // 3. Loop and Insert
    for (const bureau of ropaData) {
      await pool.query(
        'INSERT INTO ropa_bureaus (id, name, has_data) VALUES ($1, $2, $3)',
        [bureau.bureauId, bureau.bureauName, bureau.hasData]
      );

      if (bureau.subDepartments && bureau.subDepartments.length > 0) {
        for (const dept of bureau.subDepartments) {
          await pool.query(
            'INSERT INTO ropa_departments (id, bureau_id, name, color) VALUES ($1, $2, $3, $4)',
            [dept.id, bureau.bureauId, dept.name, dept.color]
          );

          if (dept.activities && dept.activities.length > 0) {
            for (const act of dept.activities) {
              await pool.query(
                `INSERT INTO ropa_activities (
                  id, department_id, name, data_controller, dpo, contact_info, 
                  form_name_a1, data_source_a2, general_data, sensitive_data, 
                  lawful_basis_24, lawful_basis_26, purpose_of_collection_c1, 
                  data_user_c2, collection_source_c3, collection_medium_c4, 
                  physical_storage_d1, electronic_storage_d2, internal_usage_e1, 
                  internal_access_e2, external_disclosure_f1, transfer_mode_f2, 
                  retention_period_g1, disposal_method_g2, technical_measures_h1, 
                  organizational_measures_h2, activity_status_i1, last_update_i2, revision_i3
                ) VALUES (
                  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
                  $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
                )`,
                [
                  act.id, dept.id, act.name, act.dataController, act.dpo, 
                  JSON.stringify(act.contactInfo || {}), 
                  act.formNameA1, act.dataSourceA2, 
                  JSON.stringify(act.generalData || []), 
                  JSON.stringify(act.sensitiveData || []), 
                  act.lawfulBasis24, act.lawfulBasis26, act.purposeOfCollectionC1, 
                  act.dataUserC2, act.collectionSourceC3, act.collectionMediumC4, 
                  act.physicalStorageD1, act.electronicStorageD2, act.internalUsageE1, 
                  act.internalAccessE2, act.externalDisclosureF1, act.transferModeF2, 
                  act.retentionPeriodG1, act.disposalMethodG2, act.technicalMeasuresH1, 
                  act.organizationalMeasuresH2, act.activityStatusI1, act.lastUpdateI2, act.revisionI3
                ]
              );
            }
          }
        }
      }
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();