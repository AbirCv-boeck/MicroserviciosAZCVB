use async_graphql::{Schema, Object, Context, Result};
use crate::models::Envio;
use crate::db::get_pool;
use chrono::Utc;
use sqlx::Row;
use crate::grpc_client::verificar_disponibilidad;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn envios(&self, ctx: &Context<'_>) -> Result<Vec<Envio>> {
        let pool = get_pool().await;
        let envios = sqlx::query_as!(Envio, "SELECT * FROM envios")
            .fetch_all(&pool)
            .await?;
        Ok(envios)
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn crear_envio(
        &self,
        ctx: &Context<'_>,
        usuario_id: i32,
        vehiculo_id: i32,
        origen: String,
        destino: String
    ) -> Result<Envio> {
        // Verificar disponibilidad via gRPC
        let disponible = verificar_disponibilidad(vehiculo_id).await;
        if !disponible {
            return Err("Vehículo no disponible".into());
        }

        let pool = get_pool().await;
        let fecha = Utc::now().naive_utc();
        let estado = "pendiente";

        let res = sqlx::query_as!(
            Envio,
            "INSERT INTO envios (usuario_id, vehiculo_id, origen, destino, fecha_envio, estado)
             VALUES (?, ?, ?, ?, ?, ?)
             RETURNING id, usuario_id, vehiculo_id, origen, destino, fecha_envio, estado",
            usuario_id,
            vehiculo_id,
            origen,
            destino,
            fecha,
            estado
        )
        .fetch_one(&pool)
        .await?;

        Ok(res)
    }
}

pub type EnviosSchema = Schema<QueryRoot, MutationRoot, async_graphql::EmptySubscription>;
