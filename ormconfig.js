module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "cp_game",
    "entities": ["src/**/**.entity{.ts,.js}"],
    "synchronize": false,
    "migrationsTableName": "migrations",
    "migrations": ["migrations/*.ts"],
    "cli": {
        "migrationsDir": "migrations"
    },
    seeds: ['seeds/*.seed.ts'],
  }