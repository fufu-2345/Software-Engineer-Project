@echo off
call npm install

cd client
call npm install

cd ../server
call npm install
copy .env.example .env

cd ..

echo .
echo .
echo ** you can close this page **
echo .
code .