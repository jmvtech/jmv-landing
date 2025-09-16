@echo off
echo Fazendo deploy da JMV Technologies Landing Page...
echo.

REM Instalar Netlify CLI se necessario
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Instalando Netlify CLI...
    npm install -g netlify-cli
)

REM Configurar token
set NETLIFY_AUTH_TOKEN=nfp_gvAbbrCNKNXQ866dBKy56LrjQP6Jk9181009

REM Fazer deploy
echo Fazendo deploy no Netlify...
netlify deploy --prod --dir . --site jmvtech-landing

echo.
echo Deploy concluido! Verifique a URL gerada acima.
pause
