#!/usr/bin/env node

import initSqlJs from 'sql.js';
import fs from 'fs';

async function checkSchema() {
  try {
    const SQL = await initSqlJs();
    const dbData = fs.readFileSync('./data/app.db');
    const db = new SQL.Database(dbData);

    console.log('=== SUPPLIER TABLE SCHEMA ===');
    const supplierSchema = db.exec("PRAGMA table_info(Supplier)");
    if (supplierSchema.length > 0) {
      console.log('Columns:');
      supplierSchema[0].values.forEach(row => {
        console.log(`  ${row[1]} (${row[2]})`);
      });
    }

    console.log('\n=== CHECKING A SAMPLE SUPPLIER ===');
    const sampleSupplier = db.exec("SELECT * FROM Supplier LIMIT 1");
    if (sampleSupplier.length > 0) {
      console.log('Sample row columns:', sampleSupplier[0].columns);
    }

    console.log('\n=== PROPOSAL TABLE SCHEMA ===');
    const proposalSchema = db.exec("PRAGMA table_info(Proposal)");
    if (proposalSchema.length > 0) {
      console.log('Columns:');
      proposalSchema[0].values.forEach(row => {
        console.log(`  ${row[1]} (${row[2]})`);
      });
    }

    db.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();