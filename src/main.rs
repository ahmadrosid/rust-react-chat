use std:: {
    sync:: {
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
    time::Instant,
};

use actix::*;
use actix_files::{NamedFile, Files};
use actix_web::{HttpRequest, HttpResponse, web, Responder, App, Error, HttpServer};
use actix_web_actors::ws;

mod server;
mod session;

async fn index() -> impl Responder {
    NamedFile::open_async("./static/index.html").await.unwrap()
}

async fn chat(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<server::ChatServer>>,
) -> Result<HttpResponse, Error> {
    ws::start(session::WsChatSession{
        id: 0,
        hb: Instant::now(),
        room: "main".to_owned(),
        name: None,
        addr: srv.get_ref().clone(),
    }, &req, stream)
}

async fn get_count(count: web::Data<AtomicUsize>) -> impl Responder {
    let current_count = count.load(Ordering::SeqCst);
    format!("Visitors: {current_count}")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = Arc::new(AtomicUsize::new(0));
    let server = server::ChatServer::new(app_state.clone()).start();

    HttpServer::new(move || {
        App::new()
        .app_data(web::Data::from(app_state.clone()))
        .app_data(web::Data::new(server.clone()))
        .service(web::resource("/").to(index))
        .route("/count",web::get().to(get_count))
        .route("/ws", web::get().to(chat))
        .service(Files::new("/", "./static"))
    })
    .workers(2)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}