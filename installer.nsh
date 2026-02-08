!macro customInstall
  ; Add to Windows startup (Run at login in background)
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "ChrisGPT" '"$INSTDIR\ChrisGPT.exe" --hidden'
!macroend

!macro customUnInstall
  ; Remove from Windows startup
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "ChrisGPT"
!macroend
