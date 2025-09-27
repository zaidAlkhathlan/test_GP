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

Write-Host "Creating buyer with data:" -ForegroundColor Yellow
Write-Host $buyerData -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers" -Method POST -Body $buyerData -ContentType "application/json"
    Write-Host "`n✅ Buyer created successfully!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
} catch {
    Write-Host "`n❌ Error creating buyer:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error details: $errorContent" -ForegroundColor Red
    }
}