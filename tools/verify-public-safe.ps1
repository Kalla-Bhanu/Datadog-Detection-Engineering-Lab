[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$scannerPath = [System.IO.Path]::GetFullPath($MyInvocation.MyCommand.Path).ToLowerInvariant()

$patterns = @(
    "nitin\.k\.neu",
    "DD-API-KEY",
    "DD-APPLICATION-KEY",
    "api_key",
    "app_key",
    "sessionid",
    "cookie:",
    "x-datadog-token",
    "\bAKIA[0-9A-Z]{16}\b",
    "\b[0-9]{12}\b"
)

$files = Get-ChildItem -Path $root -Recurse -File -Force |
    Where-Object {
        $_.FullName -notmatch "\\\.git\\" -and
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\\.cache\\" -and
        ([System.IO.Path]::GetFullPath($_.FullName).ToLowerInvariant()) -ne $scannerPath
    }

$hits = @()
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $hits += [PSCustomObject]@{
                File = $file.FullName.Substring($root.Length + 1)
                Pattern = $pattern
            }
        }
    }
}

if ($hits.Count -gt 0) {
    $hits | Format-Table -AutoSize
    throw "Public-safe verification failed."
}

Write-Host "Public-safe verification passed across $($files.Count) files."
