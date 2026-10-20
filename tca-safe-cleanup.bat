@echo off
setlocal
echo === TCA SAFE CLEANUP & BUILD ===
if not exist "src\App.tsx" (echo ERROR: Run this from the tca-scaffold project root.& exit /b 1)
if not exist "src\AppRoutes.tsx" (echo ERROR: AppRoutes.tsx not found.& exit /b 1)
if not exist "src\components\navigation\Navlinks.tsx" (echo ERROR: Navlinks.tsx not found.& exit /b 1)
set "BACKUP=tca-cleanup-backup"
if exist "%BACKUP%" (echo ERROR: Backup folder already exists. Rename it before retrying.& exit /b 1)
mkdir "%BACKUP%"
xcopy "src\components\sections\Programs" "%BACKUP%\Programs\" /E /I /H /Y
xcopy "src\components\sections\Testimonials" "%BACKUP%\Testimonials\" /E /I /H /Y
xcopy "src\components\sections\Gallery" "%BACKUP%\GallerySection\" /E /I /H /Y
xcopy "src\pages\Programs" "%BACKUP%\ProgramsPage\" /E /I /H /Y
xcopy "src\pages\Gallery" "%BACKUP%\GalleryPage\" /E /I /H /Y
copy "src\App.tsx" "%BACKUP%\App.tsx"
copy "src\AppRoutes.tsx" "%BACKUP%\AppRoutes.tsx"
copy "src\components\navigation\Navlinks.tsx" "%BACKUP%\Navlinks.tsx"
echo.
echo Backup created. No source files have been changed yet.
echo For safety, automatic editing is stopped here.
echo Review the backup and use VS Code for the exact source edits.
echo Original image folders remain untouched.
pause
