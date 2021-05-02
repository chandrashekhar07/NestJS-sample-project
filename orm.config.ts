import { TypeOrmModule } from "@nestjs/typeorm";

const config:TypeOrmModule = {

    "type": "postgres",
     "host": "localhost",
     "port": 5432,
     "username": "postgres",
     "password": "admin",
     "database": "jwsAuthentication",
     "synchronize": true,
     "logging": true,
     "entities": ["dist/**/*.entity{.ts,.js}"],

    // "migrations": [
    //     "dist/src/db/migrations/*.js"
    // ],
    // // "subscribers": [
    //     "src/subscriber/**/*.ts"
    // ],
    "cli": {
        //"entitiesDir": "src/entity",
        "migrationsDir": "src/db/migrations",
      //  "subscribersDir": "src/subscriber"
    }

}


export default config;