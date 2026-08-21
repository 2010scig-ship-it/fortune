Add-Type -AssemblyName System.Drawing

$taskRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $taskRoot "public\pwa"
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

$targets = @(
  @{ Name = "icon-192.png"; Size = 192; Maskable = $false },
  @{ Name = "icon-512.png"; Size = 512; Maskable = $false },
  @{ Name = "maskable-512.png"; Size = 512; Maskable = $true },
  @{ Name = "apple-touch-icon.png"; Size = 180; Maskable = $false }
)

foreach ($target in $targets) {
  $size = [int]$target.Size
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml("#102c21"))

  $safeInset = if ($target.Maskable) { [int]($size * 0.22) } else { [int]($size * 0.13) }
  $circleSize = $size - ($safeInset * 2)
  $creamBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#f4efe4"))
  $goldPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml("#bd9458"), [Math]::Max(2, $size * 0.012))
  $graphics.FillEllipse($creamBrush, $safeInset, $safeInset, $circleSize, $circleSize)
  $ringInset = $safeInset + [int]($size * 0.035)
  $ringSize = $size - ($ringInset * 2)
  $graphics.DrawEllipse($goldPen, $ringInset, $ringInset, $ringSize, $ringSize)

  $fontSize = if ($target.Maskable) { $size * 0.30 } else { $size * 0.36 }
  $font = [System.Drawing.Font]::new("Yu Mincho", $fontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $inkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#183d2d"))
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString("結", $font, $inkBrush, [System.Drawing.RectangleF]::new(0, 0, $size, $size), $format)

  $targetPath = Join-Path $outputDirectory $target.Name
  $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $format.Dispose()
  $inkBrush.Dispose()
  $font.Dispose()
  $goldPen.Dispose()
  $creamBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
