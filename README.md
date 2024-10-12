<h2 align="center">
  UJokes Website <br/>
  <a href="https://ujokes.pp.ua" target="_blank">ujokes.pp.ua</a>
</h2>



## Built With

A website with jokes.<br>
It has features like user authentication, liking or disliking, dark and light themes, sharing jokes, and a history of read jokes.<br>

This project was built using these technologies.

- React.js
- FastAPI
- Google OAuth
- MUI5
- CSS3
- WebStorm

## Features

📖 Multi-Page Layout

🎨 Styled with MaterialUI with easy-to-customize colors

📱 Fully Responsive

## Getting Started

Clone down this repository.<br>
You will need `node.js`, `python` and `git` installed globally on your machine.

## 🛠 Installation and Setup Instructions

Navigate to the frontend directory: `cd joke-site-frontend`

- Set up the necessary configuration by creating a  `.env`  file and defining the required variables.

- Example  `.env`  file:

      REACT_APP_GOOGLE_CLIENT_ID=google OAuth client id 
      REACT_APP_API_BASE_URL=API url

- Install dependencies: `npm install`
- Start backend: `python(or python3) main.py`
  <br>

Navigate to the backend directory: `cd joke-site-backend`

- Set up the necessary configuration by creating a  `.env`  file and defining the required variables.

- Example  `.env`  file:

      DATABASE_URL=database connect url
      JWT_SECRET=jwt secret
      GOOGLE_CLIENT_ID=google OAuth client id 
      GOOGLE_CLIENT_SECRET=google OAuth client secret
      ORIGINS=origins for CORS
- Install dependencies: `pip install -r requirements.txt`
- Start frontend:

    ```
  npm start - for development
  
  npm run build
  npm install serve -g
  servw -s build - for production
  ```

## Docker Usage

You can start production server using: `docker compose up -d`

## GitHub Actions

This project uses GitHub Actions to automate the build and deployment of the Docker image. The workflow builds the
Docker image and pushes it to GitHub Container Registry.

### Show your support

Give a ⭐ if you like this website!