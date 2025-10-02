$loginData = @{
    account_email = "ahmed@techsolutions.com"
    account_password = "password123"
} | ConvertTo-Json

Write-Host "Testing buyer login..." -ForegroundColor Yellow
Write-Host "Email: ahmed@techsolutions.com" -ForegroundColor Cyan
Write-Host "Password: password123" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "`n✅ Login successful!" -ForegroundColor Green
        Write-Host "Buyer Info:" -ForegroundColor Green
        Write-Host "  Company: $($response.buyer.company_name)" -ForegroundColor Cyan
        Write-Host "  Name: $($response.buyer.account_name)" -ForegroundColor Cyan
        Write-Host "  Email: $($response.buyer.account_email)" -ForegroundColor Cyan
        Write-Host "  City: $($response.buyer.city)" -ForegroundColor Cyan
        Write-Host "  Industry: $($response.buyer.industry)" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Login failed: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Error testing login:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n" + "="*50 -ForegroundColor Yellow

# Test with wrong password
$wrongLoginData = @{
    account_email = "ahmed@techsolutions.com"
    account_password = "wrongpassword"
} | ConvertTo-Json

Write-Host "Testing with wrong password..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $wrongLoginData -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "`n⚠️  This should have failed! Security issue!" -ForegroundColor Red
    } else {
        Write-Host "`n✅ Correctly rejected wrong password: $($response.message)" -ForegroundColor Green
    }
} catch {
    $errorResponse = $_.Exception.Response
    if ($errorResponse.StatusCode -eq 401) {
        Write-Host "`n✅ Correctly returned 401 Unauthorized for wrong password" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Unexpected error:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}