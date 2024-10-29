//! Minimal GraphQL development server example using Actix Web + Juniper
//!
//! This server provides a GraphQL API for querying and mutating humanoid creatures
//! in a fictional universe, specifically inspired by Star Wars.

use std::{io, sync::Arc};

use actix_cors::Cors;
use actix_web::{
    middleware, route,
    web::{self, Data},
    App, HttpResponse, HttpServer, Responder,
};
use juniper::http::GraphQLRequest;

mod schema;

use crate::schema::{create_schema, Schema};

#[route("/graphql", method = "GET", method = "POST")]
async fn graphql(st: web::Data<Schema>, data: web::Json<GraphQLRequest>) -> impl Responder {
    let user = data.execute(&st, &()).await;
    HttpResponse::Ok().json(user)
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let schema = Arc::new(create_schema());

    log::info!("starting HTTP server on port 8080");

    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(schema.clone()))
            .service(graphql)
            .wrap(middleware::Logger::default())
            // GQLx Client requires CORS to be enabled.
            // NOTE: This is only for development purposes. DO NOT USE IN PROUDCTION!
            .wrap(Cors::permissive())
    })
    .workers(2)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
