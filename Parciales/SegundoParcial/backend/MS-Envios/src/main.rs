use actix_web::{web, App, HttpServer};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenv::dotenv;
use std::env;
mod db;
mod models;
mod schema;
mod grpc_client;

async fn graphql_handler(schema: web::Data<schema::EnviosSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let schema = schema::EnviosSchema::build(schema::QueryRoot, schema::MutationRoot, async_graphql::EmptySubscription).finish();

    let port = env::var("PORT").unwrap_or("4001".to_string());

    println!("Servidor GraphQL de envíos corriendo en http://localhost:{}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .route("/graphql", web::post().to(graphql_handler))
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
