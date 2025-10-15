#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Test logo upload functionality
async function testLogoUpload() {
    console.log('🧪 Testing logo upload functionality...');
    
    try {
        // Create a simple base64 test image (1x1 pixel PNG)
        const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        console.log('📝 Test image base64 length:', testImageBase64.length);
        
        // Test updating buyer with logo
        console.log('🔄 Testing buyer logo update...');
        const buyerResponse = await fetch('http://localhost:8081/api/buyers/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                logo: testImageBase64,
                company_name: 'Test Company with Logo'
            })
        });
        
        if (buyerResponse.ok) {
            const buyerData = await buyerResponse.json();
            console.log('✅ Buyer logo updated successfully');
            console.log('📊 Response logo length:', buyerData.logo ? buyerData.logo.length : 'No logo');
        } else {
            const error = await buyerResponse.json();
            console.error('❌ Buyer logo update failed:', error);
        }
        
        // Test updating supplier with logo
        console.log('🔄 Testing supplier logo update...');
        const supplierResponse = await fetch('http://localhost:8081/api/suppliers/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                logo: testImageBase64,
                company_name: 'Test Supplier with Logo'
            })
        });
        
        if (supplierResponse.ok) {
            const supplierData = await supplierResponse.json();
            console.log('✅ Supplier logo updated successfully');
            console.log('📊 Response logo length:', supplierData.logo ? supplierData.logo.length : 'No logo');
        } else {
            const error = await supplierResponse.json();
            console.error('❌ Supplier logo update failed:', error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testLogoUpload();