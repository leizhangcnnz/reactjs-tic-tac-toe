Command line instructions

Git global setup
git config --global user.name "Lei"
git config --global user.email "lei.zhang@kiwiplan.co.nz"

Create a new repository
git clone http://localhost:10080/lei/reactjs-practise.git
cd reactjs-practise
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master

Existing folder
cd existing_folder
git init
git remote add origin http://localhost:10080/lei/reactjs-practise.git
git add .
git commit -m "Initial commit"
git push -u origin master

Existing Git repository
cd existing_repo
git remote rename origin old-origin
git remote add origin http://localhost:10080/lei/reactjs-practise.git
git push -u origin --all
git push -u origin --tags

Success! Created aviemore at /home/lei.zhang/workspace/aviemore
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd aviemore
  npm start

Happy hacking!