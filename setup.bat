@echo off
call npm install
copy .env.example .env

cd client
call npm install
cd ..

cd server
call npm install

code ..
cd ..

echo .
echo .
echo ** you can close this page **
echo .