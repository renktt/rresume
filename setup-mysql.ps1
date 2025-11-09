# MySQL Setup Script for Windows
# This script will configure MySQL for your portfolio system

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Database Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Add MySQL to PATH for this session
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.4\bin"

# MySQL Configuration
$mysqlRoot = "C:\Program Files\MySQL\MySQL Server 8.4"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.4\Data"
$mysqlIniPath = "C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"

Write-Host "Step 1: Creating MySQL data directory..." -ForegroundColor Yellow
if (!(Test-Path $dataDir)) {
    New-Item -Path $dataDir -ItemType Directory -Force | Out-Null
    Write-Host "✓ Data directory created" -ForegroundColor Green
} else {
    Write-Host "✓ Data directory already exists" -ForegroundColor Green
}

Write-Host "`nStep 2: Initializing MySQL database..." -ForegroundColor Yellow
& "$mysqlRoot\bin\mysqld.exe" --initialize-insecure --datadir="$dataDir"
Write-Host "✓ MySQL initialized (root user with no password)" -ForegroundColor Green

Write-Host "`nStep 3: Installing MySQL service..." -ForegroundColor Yellow
& "$mysqlRoot\bin\mysqld.exe" --install MySQL84 --defaults-file="$mysqlIniPath"
Write-Host "✓ MySQL service installed" -ForegroundColor Green

Write-Host "`nStep 4: Starting MySQL service..." -ForegroundColor Yellow
Start-Service MySQL84
Start-Sleep -Seconds 5
Write-Host "✓ MySQL service started" -ForegroundColor Green

Write-Host "`nStep 5: Creating portfolio database..." -ForegroundColor Yellow
$createDbScript = @"
CREATE DATABASE IF NOT EXISTS portfolio;
CREATE USER IF NOT EXISTS 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password';
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
"@

$createDbScript | & "$mysqlRoot\bin\mysql.exe" -u root

Write-Host "✓ Database 'portfolio' created" -ForegroundColor Green
Write-Host "✓ User 'portfolio_user' created with password 'portfolio_password'" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MySQL Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Connection Details:" -ForegroundColor Yellow
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     3306" -ForegroundColor White
Write-Host "  Database: portfolio" -ForegroundColor White
Write-Host "  Username: portfolio_user" -ForegroundColor White
Write-Host "  Password: portfolio_password" -ForegroundColor White

Write-Host "`nConnection String:" -ForegroundColor Yellow
Write-Host "  mysql://portfolio_user:portfolio_password@localhost:3306/portfolio" -ForegroundColor Cyan

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. This connection string has been saved for .env.local" -ForegroundColor White
Write-Host "  2. Run: npm run prisma:push" -ForegroundColor White
Write-Host "  3. Run: npm run seed (optional - adds sample data)" -ForegroundColor White
Write-Host "  4. Restart your dev server" -ForegroundColor White
