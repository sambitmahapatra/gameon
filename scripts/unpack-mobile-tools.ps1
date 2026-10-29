$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cacheRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot '.cache\android-tools'))
$config = Get-Content -LiteralPath (Join-Path $projectRoot 'mobile\toolchain.json') -Raw | ConvertFrom-Json
foreach ($download in $config.downloads) {
  $destination = [System.IO.Path]::GetFullPath((Join-Path $cacheRoot $download.folder))
  $archive = [System.IO.Path]::GetFullPath((Join-Path $cacheRoot $download.file))
  if (-not $destination.StartsWith($cacheRoot + '\',[System.StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid extraction path' }
  if (-not $archive.StartsWith($cacheRoot + '\',[System.StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid archive path' }
  if (-not (Test-Path -LiteralPath $destination)) { Expand-Archive -LiteralPath $archive -DestinationPath $destination }
}
