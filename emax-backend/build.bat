@echo off
cd /d c:\Users\ADMIN\Desktop\E-max\emax-backend
echo === Regenerating Prisma Client ===
call npx.cmd prisma generate
echo.
echo === Running TypeScript Compiler ===
call npx.cmd tsc
echo.
echo === Exit Code: %ERRORLEVEL% ===
