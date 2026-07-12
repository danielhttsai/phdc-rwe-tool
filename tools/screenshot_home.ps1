<#
  Re-capture the README homepage screenshot (assets/screenshot-home.png).

  Why FastAPI and not the static docs/ build: the static site gates content
  behind the Pyodide compute-core download, so a headless snapshot catches the
  loading splash. The FastAPI dev server renders the home gallery immediately.

  Usage (from the repo root or anywhere):
      powershell -ExecutionPolicy Bypass -File tools\screenshot_home.ps1
  Optional:
      -Port 8009   -Hash "#home"   -CropTop 150   -CropHeight 838
#>
param(
  [int]$Port = 8009,
  [string]$Hash = "#home",
  [int]$CropTop = 150,
  [int]$CropHeight = 838
)
$ErrorActionPreference = "Stop"

$root  = Split-Path -Parent $PSScriptRoot          # webtool/
$out   = Join-Path $root "assets\screenshot-home.png"
$edge  = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
if (-not (Test-Path $edge)) { throw "Microsoft Edge not found; edit `$edge in this script." }
New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null

# 1. Start the FastAPI dev server (app.py uses flat imports, so run from backend\).
$uvi = Start-Process -PassThru -WindowStyle Hidden -WorkingDirectory (Join-Path $root "backend") `
  -FilePath "python" -ArgumentList @("-m","uvicorn","app:app","--port","$Port")
try {
  # 2. Wait until it answers.
  $ok = $false
  foreach ($i in 1..30) {
    try { if ((Invoke-WebRequest "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200) { $ok = $true; break } } catch {}
    Start-Sleep -Milliseconds 500
  }
  if (-not $ok) { throw "FastAPI server did not come up on port $Port." }

  # 3. Headless screenshot; virtual-time-budget lets app.js build the cards.
  #    Use the call operator (it quotes --flag=value-with-spaces correctly, unlike
  #    Start-Process), and drop $ErrorActionPreference to Continue so Edge's noisy
  #    stderr is not wrapped into a terminating error by Windows PowerShell 5.1.
  if (Test-Path $out) { Remove-Item $out }
  $tmp = Join-Path $env:TEMP ("edgeshot_" + [guid]::NewGuid().ToString("N"))
  $eargs = @(
    "--headless=new","--disable-gpu","--no-sandbox","--user-data-dir=$tmp",
    "--hide-scrollbars","--window-size=1280,1040","--virtual-time-budget=12000",
    "--screenshot=$out","http://127.0.0.1:$Port/$Hash"
  )
  $prevEAP = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  & $edge @eargs 2>$null | Out-Null
  $ErrorActionPreference = $prevEAP
  Start-Sleep 2
  if (-not (Test-Path $out)) { throw "Edge did not write the screenshot." }
  try { Remove-Item -Recurse -Force $tmp } catch {}

  # 4. Crop the empty band above the sticky header.
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($out)
  $h   = [Math]::Min($CropHeight, $img.Height - $CropTop)
  $src = New-Object System.Drawing.Rectangle(0, $CropTop, $img.Width, $h)
  $bmp = New-Object System.Drawing.Bitmap($img.Width, $h)
  $g   = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0,0,$img.Width,$h)), $src, [System.Drawing.GraphicsUnit]::Pixel)
  $w = $img.Width; $img.Dispose(); $g.Dispose()
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
  Write-Output ("Saved {0} ({1}x{2})" -f $out, $w, $h)
}
finally {
  if ($uvi -and -not $uvi.HasExited) { Stop-Process -Id $uvi.Id -Force }
}
