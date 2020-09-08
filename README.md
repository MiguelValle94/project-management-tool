# project-management-tool

[See the website deployed](https://project-management-tool-miguel.herokuapp.com/login)

### Project created to work with Express and MongoDB

##### Tools:
- Express
- MongoDB (Mongoose)
- HBS
- Axios
- Other dependencies:
    - bcrypt
    - cloudinary
    - multer
    - faker
    - morgan
    - nodemailer
    - passport

### Use:
- Once you have cloned the repository and move to the folder install the dependencies:
```
npm install
```

- Also install nodemon as DevDependency:
```
npm install nodemon --save-dev
```

- After that to populate the database exeute:
```
npm run seeds
```

- Finally once your database is running, run the application:
```
npm run dev
```
This will execute "dev": "nodemon -e hbs,js,css app.js" so you won't need to stop and run the app everytime you change anything in hbs or css.
