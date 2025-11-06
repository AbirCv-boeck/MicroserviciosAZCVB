use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use async_graphql::{SimpleObject};

#[derive(sqlx::FromRow, SimpleObject, Serialize, Deserialize)]
pub struct Envio {
    pub id: i32,
    pub usuario_id: i32,
    pub vehiculo_id: i32,
    pub origen: String,
    pub destino: String,
    pub fecha_envio: NaiveDateTime,
    pub estado: String,
}
