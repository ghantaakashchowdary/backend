@echo off
cd /d c:\Users\hp\backend-assignment
git remote add origin https://github.com/ghantaakashchowdary/backend.git 2>&1
echo Remote added or already exists
git add .
echo Files staged
git commit -m "Initial commit - All files" 2>&1
echo Commit created
git push -u origin main 2>&1
echo Push complete
pause
