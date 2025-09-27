$ErrorActionPreference = "Continue"

Write-Host "Testing server connectivity..." -ForegroundColor Yellow

# Test if server is responding at all
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend accessible: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test ping endpoint
try {
    Write-Host "`nTesting ping endpoint..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/ping" -Method GET -TimeoutSec 5
    Write-Host "✅ Ping endpoint: Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Ping endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test buyer creation
try {
    Write-Host "`nTesting buyer creation endpoint..." -ForegroundColor Yellow
    $buyerData = @{
        commercial_registration_number = "CR123456789"
        commercial_phone_number = "+966501234567"
        industry = "Technology"
        company_name = "Tech Solutions Ltd"
        city = "Riyadh"
        logo = $null
        account_name = "Ahmed Al-Rashid"
        account_email = "ahmed@techsolutions.com"
        account_phone = "+966501234567"
        account_password = "password123"
        licenses = "IT License 2024"
        certificates = "ISO 9001:2015"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/buyers" -Method POST -Body $buyerData -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Buyer creation: Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Buyer creation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error details: $errorContent" -ForegroundColor Red
    }
}