param(
  [string]$JdkHome = '',
  [string]$AndroidJar = '',
  [string]$BuildTools = ''
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
if (-not $JdkHome) { $JdkHome = Join-Path $projectRoot '.cache\android-tools\jdk\jdk-17.0.20.1+1' }
if (-not $AndroidJar) { $AndroidJar = Join-Path $projectRoot '.cache\android-tools\platform\android-35\android.jar' }
if (-not $BuildTools) { $BuildTools = Join-Path $projectRoot '.cache\android-tools\build-tools\android-15' }
$java = Join-Path $JdkHome 'bin\java.exe'
$javac = Join-Path $JdkHome 'bin\javac.exe'
$keytool = Join-Path $JdkHome 'bin\keytool.exe'
$aapt2 = Join-Path $BuildTools 'aapt2.exe'
$zipalign = Join-Path $BuildTools 'zipalign.exe'
$dexCompiler = Join-Path $BuildTools 'lib\d8.jar'
$apkSigner = Join-Path $BuildTools 'lib\apksigner.jar'
foreach ($required in @($java,$javac,$keytool,$AndroidJar,$aapt2,$zipalign,$dexCompiler,$apkSigner)) {
  if (-not (Test-Path -LiteralPath $required)) { throw "Missing Android build dependency: $required. See mobile/README.md." }
}
function Invoke-Checked([string]$Program,[string[]]$Arguments) {
  & $Program @Arguments
  if ($LASTEXITCODE -ne 0) { throw "Build command failed: $Program (exit $LASTEXITCODE)" }
}
Invoke-Checked 'npx.cmd' @('tsx','scripts/build-mobile-html.ts')
$build = Join-Path $projectRoot '.cache\mobile-build'
$shell = Join-Path $projectRoot 'mobile\shell'
$output = Join-Path $projectRoot 'GameON application'
$classes = Join-Path $build 'classes'
$dex = Join-Path $build 'dex'
New-Item -ItemType Directory -Path $classes,$dex,$output -Force | Out-Null
$sources = @(Get-ChildItem -LiteralPath (Join-Path $shell 'src') -Recurse -Filter '*.java' | ForEach-Object { $_.FullName })
Invoke-Checked $javac (@('-encoding','UTF-8','--release','8','-classpath',$AndroidJar,'-d',$classes) + $sources)
$bytecode = @(Get-ChildItem -LiteralPath $classes -Recurse -Filter '*.class' | ForEach-Object { $_.FullName })
Invoke-Checked $java (@('-cp',$dexCompiler,'com.android.tools.r8.D8','--lib',$AndroidJar,'--min-api','23','--output',$dex) + $bytecode)
$compiled = Join-Path $build 'resources.zip'
$unsigned = Join-Path $build 'unsigned.apk'
$aligned = Join-Path $build 'aligned.apk'
Invoke-Checked $aapt2 @('compile','--dir',(Join-Path $shell 'res'),'-o',$compiled)
Invoke-Checked $aapt2 @('link','-I',$AndroidJar,'--manifest',(Join-Path $shell 'AndroidManifest.xml'),'-A',(Join-Path $build 'assets'),'-o',$unsigned,$compiled)
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$archive = [System.IO.Compression.ZipFile]::Open($unsigned,[System.IO.Compression.ZipArchiveMode]::Update)
try {
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,(Join-Path $dex 'classes.dex'),'classes.dex',[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
} finally { $archive.Dispose() }
Invoke-Checked $zipalign @('-f','-p','4',$unsigned,$aligned)
$signing = Join-Path $projectRoot '.cache\mobile-signing'
New-Item -ItemType Directory -Path $signing -Force | Out-Null
$keystore = Join-Path $signing 'gameon-development.keystore'
if (-not (Test-Path -LiteralPath $keystore)) {
  Invoke-Checked $keytool @('-genkeypair','-keystore',$keystore,'-storepass','android','-keypass','android','-alias','gameon-development','-keyalg','RSA','-keysize','2048','-validity','10000','-dname','CN=GameOn Development, O=GameOn, C=IN')
}
$apk = Join-Path $output 'GameOn.apk'
Invoke-Checked $java @('-jar',$apkSigner,'sign','--ks',$keystore,'--ks-key-alias','gameon-development','--ks-pass','pass:android','--key-pass','pass:android','--v4-signing-enabled','false','--out',$apk,$aligned)
$verification = & $java '-jar' $apkSigner 'verify' '--verbose' '--print-certs' $apk
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed' }
$verification | Tee-Object -FilePath (Join-Path $output 'APK-verification.txt')
Invoke-Checked $zipalign @('-c','-p','4',$apk)
$aapt = Join-Path $BuildTools 'aapt.exe'
$badging = & $aapt 'dump' 'badging' $apk
if ($LASTEXITCODE -ne 0) { throw 'Could not inspect APK manifest' }
$badging | Set-Content -LiteralPath (Join-Path $output 'APK-manifest.txt') -Encoding UTF8
if ($badging -match '^uses-permission:') { throw 'Offline APK unexpectedly requests a permission' }
$hash = (Get-FileHash -LiteralPath $apk -Algorithm SHA256).Hash.ToLowerInvariant()
"$hash  GameOn.apk" | Set-Content -LiteralPath (Join-Path $output 'SHA256SUMS.txt') -Encoding ASCII
Write-Output "APK complete: $apk"
Write-Output "SHA256: $hash"
