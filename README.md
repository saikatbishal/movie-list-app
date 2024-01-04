# Movie List App (Frontend)

### Made with ❤️ by Saikat Bishal and `create react app`
## Technologies used

* Node
* React
* Git
* Typescript

## How to setup
* install git [here](https://git-scm.com/downloads) if you haven't already
* install node [here](https://nodejs.org/dist/v20.10.0/node-v20.10.0.pkg) if you haven't already
  type `npm -v`, `node -v` and `git -v` in your terminal to check if they were installed correctly.(checks the versions of npm, node and git respectively)
* Fork the repo.
* go to your command line and type `git clone <your-repo-link.git> `
* once the repo is cloned to your local, go to the **main** branch
* In the terminal go to the project folder and type `npm install`
* In the same terminal type `npm start`
* Create a `.env` file in the root of the project folder and add your api key as such
  ```
  REACT_APP_API_KEY = <your_api_key>
  ```
       *replace <your_api_key> with the api key you've got from the movies api*
  This is important for the code to work (to fetch data)
  <br/>
  [more info here](https://developer.themoviedb.org/docs/authentication-application#api-key)

* The app should start running on your browser of choice at `http://localhost:3000` else manually type `http://localhost:3000` in your browser

## Additional Info
  * You might encounter some errors due to incorrect installation of react-icons.
    - If so, try to install it manually through thterminal : `npm install react-icons @types/react-icons`
   
## Features
1. List of Genre (multi select)
2. Search Bar (debounce implemented to limit the number of API calls)
3. Infinite Scroll (upwards and downwards)
4. Only shows movies till the current year
5. Only shows movies with vote count >= 150
6. Starts with the year 2012 (primary_release_year)
      
    
