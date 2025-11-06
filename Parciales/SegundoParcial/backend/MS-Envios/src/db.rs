use sqlx::mysql::MySqlPoolOptions;

use sqlx::MySql;
use dotenv::dotenv;
use std::env;

pub async fn get_pool() -> sqlx::Pool<MySql> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL debe estar definido");
    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Error conectando a la base de datos")
}
