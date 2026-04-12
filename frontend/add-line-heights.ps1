# Add better line-height (leading) to components for improved readability

Get-ChildItem -Path 'src' -Recurse -Filter '*.tsx' | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $original = $content
  
  # Headings - thêm leading-snug
  $content = $content -replace '(className="[^"]*text-2xl[^"]*)"', '$1 leading-snug"'
  $content = $content -replace '(className="[^"]*text-xl[^"]*)"', '$1 leading-snug"'
  $content = $content -replace '(className="[^"]*text-lg[^"]*)"', '$1 leading-normal"'
  
  # Paragraph/body text - thêm leading-relaxed
  $content = $content -replace '(className="[^"]*text-base[^"]*)"', '$1 leading-relaxed"'
  $content = $content -replace '(className="[^"]*text-sm[^"]*text-slate-[0-9])'  , '$1 leading-relaxed'
  
  # H3/H4 headings - thêm leading-normal
  $content = $content -replace '(<h[34][^>]*className="[^"]*font-bold[^"]*)"', '$1 leading-tight"'
  
  if ($content -ne $original) {
    Set-Content $_.FullName -Value $content -Encoding UTF8
    Write-Host '' $_.Name -ForegroundColor Green
  }
}

Write-Host "
 Line-height improvements applied!" -ForegroundColor Green