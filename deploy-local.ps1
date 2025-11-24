# Deploy to local Home Assistant for testing
param(
    [Parameter(Mandatory=$true)]
    [string]$HAConfigPath
)

Write-Host "Building project..." -ForegroundColor Cyan
npm run build

Write-Host "Deploying to Home Assistant..." -ForegroundColor Yellow
$targetPath = Join-Path $HAConfigPath "custom_components\button_card_architect"

# Remove old installation
if (Test-Path $targetPath) {
    Remove-Item -Recurse -Force $targetPath
    Write-Host "Removed old installation" -ForegroundColor Green
}

# Copy new files
Copy-Item -Recurse "custom_components\button_card_architect" -Destination (Join-Path $HAConfigPath "custom_components\")
Write-Host "Files copied to $targetPath" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart Home Assistant" -ForegroundColor White
Write-Host "2. Go to Settings -> Devices & Services -> Add Integration" -ForegroundColor White
Write-Host "3. Search for 'Button Builder'" -ForegroundColor White
Write-Host "4. Check sidebar for 'Button Builder' panel" -ForegroundColor White
