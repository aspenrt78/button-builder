# Deploy Button Card Architect to Home Assistant
$haConfig = "\\192.168.0.84\config"
$targetDir = "$haConfig\custom_components\button_builder"

Write-Host "Deploying Button Card Architect to Home Assistant..." -ForegroundColor Cyan

# Create directory structure
Write-Host "`nCreating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$targetDir" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\icons" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\translations" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\www" | Out-Null

# Copy root files
Write-Host "`nCopying root files..." -ForegroundColor Yellow
Copy-Item "custom_components\button_builder\__init__.py" "$targetDir\__init__.py" -Force
Write-Host "  ✓ __init__.py"
Copy-Item "custom_components\button_builder\config_flow.py" "$targetDir\config_flow.py" -Force
Write-Host "  ✓ config_flow.py"
Copy-Item "custom_components\button_builder\manifest.json" "$targetDir\manifest.json" -Force
Write-Host "  ✓ manifest.json"
Copy-Item "custom_components\button_builder\strings.json" "$targetDir\strings.json" -Force
Write-Host "  ✓ strings.json"

# Copy icons
Write-Host "`nCopying icons..." -ForegroundColor Yellow
Get-ChildItem "custom_components\button_builder\icons\*" -File | ForEach-Object {
    Copy-Item $_.FullName "$targetDir\icons\$($_.Name)" -Force
    Write-Host "  � icons\$($_.Name)"
}

# Copy translations
Write-Host "`nCopying translations..." -ForegroundColor Yellow
Copy-Item "custom_components\button_builder\translations\en.json" "$targetDir\translations\en.json" -Force
Write-Host "  ✓ translations\en.json"

# Copy www files
Write-Host "`nCopying www files..." -ForegroundColor Yellow
Get-ChildItem "custom_components\button_builder\www\*" -File | ForEach-Object {
    Copy-Item $_.FullName "$targetDir\www\$($_.Name)" -Force
    Write-Host "  � www\$($_.Name)"
}

Write-Host "`n✓ Deployment complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart Home Assistant" -ForegroundColor White
Write-Host "2. Go to Settings → Devices & Services" -ForegroundColor White
Write-Host "3. Click 'Add Integration' and search for 'Button Builder'" -ForegroundColor White
