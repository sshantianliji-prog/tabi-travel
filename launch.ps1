$listening = netstat -ano 2>$null | Select-String ":3000.*LISTENING"

if (-not $listening) {
    Start-Process -FilePath "powershell.exe" `
        -ArgumentList "-WindowStyle Normal -Command `"Set-Location 'c:\Users\aya18\Downloads\新しいフォルダー (2)\travel-planner'; `$env:NODE_OPTIONS='--use-system-ca'; npm run dev`"" `
        -WindowStyle Normal
    $max = 30
    $count = 0
    while ($count -lt $max) {
        Start-Sleep -Seconds 1
        $up = netstat -ano 2>$null | Select-String ":3000.*LISTENING"
        if ($up) { break }
        $count++
    }
}

Start-Process "http://localhost:3000"
