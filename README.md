#Frontend

used React + JS.

npm install

npx create-react-app app_name
npm install -D tailwindcss postcss autoprefixer

npm install react-router-dom

npm run start  // to start the dev env.


#Backend

used Django

cd app_name

python venv venv

source /venv/bin/activate

pip install -r requirements.txt

mkdir auth

cd auth # acts kind of like api gateway

python manage.py startapp app_name # actual backend app 1 for auth functionality

python manage.py runserver
