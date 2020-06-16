module.exports = {
  development: {
    dialect: "postgres",
    storage: "./db.development.postgres",
    username: "admin",
    password: "1234"
  },
  test: {
    dialect: "postgres",
    storage: ":memory:"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL'
  }
};
