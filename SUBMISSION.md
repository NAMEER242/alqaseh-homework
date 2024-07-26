# Al-Qaseh Homework
This project is the submission for [Al-Qaseh Homework](REQUIREMENTS.md).

# Setup Instructions
This is a `node` project, so you will need `Node.Js` installed on your local machine and it should be greater than or equal to `16.14.0`

Follow these instruction to run the project:
### 1. install dependencies:
    ```bash
    npm install
    ```

### 2. configuring the server using an `.env` file created in the root directory of the project, use the following properties to configure the nest application:

   - `APP_ENV_PATH`: The file path to the environment configuration file.
    
   - `APP_PORT:`The port number on which the application will run.
    
   - `SUPERUSER_EMAIL`: The email address of the superuser for the application, used for administrative purposes.
    
   - `SUPERUSER_PASS`: The password for the superuser.
    
   - `DB_TYPE`: The type of the database (e.g., postgres, mysql, sqlite).
    
   - `DB_HOST`: The hostname or IP address of the database server.
    
   - `DB_PORT`: The port number on which the database server is listening.
    
   - `DB_NAME`: The name of the database to connect to.
    
   - `DB_USERNAME`: The username used to connect to the database.
    
   - `DB_PASSWORD`: The password used to connect to the database.
    
   - `DB_LOGGING`: A flag to enable or disable logging for database operations.
    
   - `DB_SYNCHRONIZE`: A boolean flag indicating whether to synchronize the database schema with the entities automatically.
    
   - `DB_AUTO_LOAD_ENTITIES`: A boolean flag indicating whether to automatically load all entities. Default is true.
    
   - `JWT_SECRET_USER_ACCESS`: The secret key used for signing user access tokens.
    
   - `JWT_TTL_USER_ACCESS`: The time-to-live (TTL) for user access tokens, in seconds.
    
   - `JWT_SECRET_USER_REFRESH`: The secret key used for signing user refresh tokens.
    
   - `JWT_TTL_USER_REFRESH`: The time-to-live (TTL) for user refresh tokens, in seconds.
    
        ### example:

        ```
        APP_ENV_PATH= ''
        APP_PORT= 3000
        SUPERUSER_EMAIL=superuser@gmail.com
        SUPERUSER_PASS=superuser
        
        DB_TYPE=
        DB_HOST=
        DB_PORT=
        DB_NAME=
        DB_USERNAME=
        DB_PASSWORD=
        DB_LOGGING=
        DB_SYNCHRONIZE=false
        DB_AUTO_LOAD_ENTITIES=true
        
        JWT_SECRET_USER_ACCESS=b52f38e49d2e5f18c865d1362b76cee51c1a8e7f7bd6598339fab0aafd61318a
        JWT_TTL_USER_ACCESS=43200
        JWT_SECRET_USER_REFRESH=ccc432cf4ae7eb5170e088be433cb6df37347041fb0229a02ea3f2ec42fa674c
        JWT_TTL_USER_REFRESH=86400
        ```
     
### 3. Run migrations:
```bash
npm run migration:run
```

### 4. Run the Server:
```bash
npm run start
```

