#!/usr/bin/env node

import fs from 'fs';
import initSqlJs from 'sql.js';

const DATABASE_PATH = './data/app.db';

async function migrateOffersToProposals() {
  console.log('🔄 Starting migration from offers/offer_files to Proposal table...');
  
  // Initialize sql.js
  const SQL = await initSqlJs();
  
  // Load existing database
  const filebuffer = fs.readFileSync(DATABASE_PATH);
  const db = new SQL.Database(filebuffer);

  try {
    // Check if old tables exist
    const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND (name='offers' OR name='offer_files');");
    const existingTables = tablesResult.length > 0 ? tablesResult[0].values.flat() : [];
    
    console.log('📋 Existing offer tables found:', existingTables);
    
    if (existingTables.includes('offers')) {
      // Check if there's any data in offers table
      const offersData = db.exec('SELECT COUNT(*) as count FROM offers;');
      const offersCount = offersData.length > 0 && offersData[0].values.length > 0 ? offersData[0].values[0][0] : 0;
      
      console.log(`📊 Found ${offersCount} existing offers to migrate`);
      
      if (offersCount > 0) {
        console.log('🔄 Migrating existing offers to Proposal table...');
        
        // Get all offers with their files
        const offersResult = db.exec(`
          SELECT o.id, o.tender_id, o.supplier_id, o.offer_value, 
                 o.additional_notes, o.submitted_at,
                 s.company_name
          FROM offers o 
          LEFT JOIN Supplier s ON o.supplier_id = s.ID
        `);
        
        if (offersResult.length > 0) {
          const offers = offersResult[0].values.map(row => {
            const columns = offersResult[0].columns;
            const offer = {};
            row.forEach((value, index) => {
              offer[columns[index]] = value;
            });
            return offer;
          });
          
          // Migrate each offer to proposal
          for (const offer of offers) {
            console.log(`➤ Migrating offer ${offer.id} for tender ${offer.tender_id}`);
            
            // Get files for this offer
            let financial_file = null, technical_file = null, company_file = null, extra_file = null;
            let extra_description = '';
            
            try {
              const filesResult = db.exec('SELECT file_type, file_data, file_name FROM offer_files WHERE offer_id = ?', [offer.id]);
              if (filesResult.length > 0) {
                const files = filesResult[0].values.map(row => ({
                  file_type: row[0],
                  file_data: row[1],
                  file_name: row[2]
                }));
                
                for (const file of files) {
                  switch (file.file_type) {
                    case 'financial':
                      financial_file = file.file_data;
                      break;
                    case 'technical':
                      technical_file = file.file_data;
                      break;
                    case 'company':
                      company_file = file.file_data;
                      break;
                    case 'additional':
                      extra_file = file.file_data;
                      extra_description = file.file_name || '';
                      break;
                  }
                }
              }
            } catch (error) {
              console.warn(`  ⚠️ Could not migrate files for offer ${offer.id}:`, error.message);
            }
            
            // Insert into Proposal table
            const insertStmt = db.prepare(`
              INSERT INTO Proposal (
                reference_number, proposal_price, created_at, company_name, 
                project_description, financial_file, technical_file, company_file, 
                extra_file, extra_description, tender_id, supplier_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            insertStmt.run([
              null, // reference_number - will be auto-generated if needed
              offer.offer_value,
              offer.submitted_at,
              offer.company_name || '',
              offer.additional_notes || '',
              financial_file,
              technical_file,
              company_file,
              extra_file,
              extra_description,
              offer.tender_id,
              offer.supplier_id
            ]);
            
            insertStmt.free();
            console.log(`  ✅ Migrated offer ${offer.id} to proposal`);
          }
          
          console.log(`✅ Successfully migrated ${offers.length} offers to Proposal table`);
        }
      }
      
      // Drop old tables after successful migration
      console.log('🗑️ Cleaning up old offer tables...');
      db.exec('DROP TABLE IF EXISTS offer_files;');
      db.exec('DROP TABLE IF EXISTS offers;');
      console.log('✅ Old offer tables removed');
    }
    
    // Verify Proposal table exists and show count
    const proposalResult = db.exec('SELECT COUNT(*) as count FROM Proposal;');
    const proposalCount = proposalResult.length > 0 && proposalResult[0].values.length > 0 ? proposalResult[0].values[0][0] : 0;
    console.log(`📊 Proposal table now contains ${proposalCount} records`);

    // Save the modified database
    const data = db.export();
    fs.writeFileSync(DATABASE_PATH, data);
    console.log('💾 Database saved successfully');
    
    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    if (db) {
      db.close();
    }
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateOffersToProposals().catch(console.error);
}

export { migrateOffersToProposals };