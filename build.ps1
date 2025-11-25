# Build and Release Script
# This script builds the app and prepares it for release

Write-Host "Building Button Builder..." -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the app
Write-Host "Building production assets..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (Test-Path "custom_components\button_builder\www\index.js") {
    Write-Host "✓ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Built files are in: custom_components\button_builder\www\" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Copy custom_components\button_builder to your Home Assistant config folder"
    Write-Host "2. Restart Home Assistant"
    Write-Host "3. Find 'Button Architect' in your sidebar"
    Write-Host ""
    Write-Host "For HACS release:" -ForegroundColor Yellow
    Write-Host "1. Commit all changes to git"
    Write-Host "2. Create a new tag: git tag v1.0.0"
    Write-Host "3. Push with tags: git push origin main --tags"
    Write-Host "4. Create a GitHub release from the tag"
} else {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
