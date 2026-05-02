[CmdletBinding()]
param(
    [int]$Port = 4175
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Serving Datadog dashboard from $root on http://127.0.0.1:$Port/"

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    $python = Get-Command py -ErrorAction SilentlyContinue
}
if (-not $python) {
    throw "Python was not found. Install Python or use another static file server."
}

Push-Location $root
try {
    if ($python.Name -eq "py.exe") {
        & $python.Source -3 -m http.server $Port --bind 127.0.0.1
    } else {
        & $python.Source -m http.server $Port --bind 127.0.0.1
    }
} finally {
    Pop-Location
}

