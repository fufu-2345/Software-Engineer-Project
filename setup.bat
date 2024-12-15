@echo on
call npm install

cd client
call npm install
cd ..

cd server
call npm install

code ..

