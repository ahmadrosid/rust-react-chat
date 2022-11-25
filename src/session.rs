use std::time::{Duration, Instant};
use std::fmt;

use actix::prelude::*;
use actix_web::web;
use actix_web_actors::ws;
use serde::{Serialize, Deserialize};

use diesel::{
    prelude::*,
    r2d2::{self, ConnectionManager},
};

use crate::server;

const HEARBET: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);
type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

#[derive(Debug)]
pub struct WsChatSession {
    pub id: usize,
    pub hb: Instant,
    pub room: String,
    pub name: Option<String>,
    pub addr: Addr<server::ChatServer>,
    pub db_pool: web::Data<DbPool>
}

#[derive(Serialize, Deserialize)]
pub enum ChatType {
    STATUS,
    TYPING,
    TEXT,
    CONNECT,
    DISCONNECT,
}

#[derive(Serialize, Deserialize)]
struct ChatMessage {
    pub chat_type: ChatType,
    pub value: Vec<String>,
    pub room_id: String,
    pub user_id: String,
    pub id: usize,
}

#[derive(Debug, Serialize, Deserialize)]
struct InputMessage {
    pub chat_type: String,
    pub value: Vec<String>,
    pub room_id: String,
    pub user_id: String,
}

impl fmt::Display for ChatType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ChatType::STATUS => write!(f, "STATUS"),
            ChatType::TEXT => write!(f, "TEXT"),
            ChatType::TYPING => write!(f, "TYPING"),
            ChatType::CONNECT => write!(f, "CONNECT"),
            ChatType::DISCONNECT => write!(f, "DISCONNECT"),
        }
    }
}


impl Actor for WsChatSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);

        let addr = ctx.address();

        self.addr
            .send(server::Connect{
                addr: addr.recipient(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(res) => act.id = res,
                    _ => ctx.stop()
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        self.addr.do_send(server::Disconnect{id: self.id});
        Running::Stop
    }
}

impl Handler<server::Message> for WsChatSession {
    type Result = ();
    fn handle(&mut self, msg: server::Message, ctx: &mut Self::Context) -> Self::Result {
        ctx.text(msg.0);
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsChatSession {
    fn handle(&mut self, item: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        let msg = match item {
            Err(_) => {
                ctx.stop();
                return;
            },
            Ok(msg) => msg
        };

        match msg {
            ws::Message::Ping(msg) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            ws::Message::Pong(_) => {
                self.hb = Instant::now();
            }
            ws::Message::Text(text) => {
                let data_json = serde_json::from_str::<InputMessage>(&text.to_string());
                if data_json.is_err() {
                    println!("Failed to parse message: {text}");
                    return;
                }

                let input = data_json.as_ref().unwrap();

                if input.chat_type == ChatType::TYPING.to_string() {
                    let chat_msg = ChatMessage {
                        chat_type: ChatType::TYPING,
                        value: input.value.to_vec(),
                        id: self.id,
                        room_id: input.room_id.to_string(),
                        user_id: input.user_id.to_string(),
                    };
                    let msg = serde_json::to_string(&chat_msg).unwrap();
                    self.addr.do_send(server::ClientMessage{
                        id: self.id,
                        msg,
                        room: self.room.clone(),
                    })
                }

                let m = text.trim();
                let room_id = self.room.to_string();
                if m.starts_with("/") {
                    let v: Vec<&str> = m.splitn(2, ' ').collect();
                    match v[0] {
                        "/join" => {
                            if v.len() == 2 {
                                self.room = v[1].to_owned();
                                self.addr.do_send(server::Join {
                                    id: self.id,
                                    name: self.room.clone(),
                                });
                            }
                        }
                        "/typing" => {
                            if v.len() == 2 {
                                
                            }
                        }
                        "/name" => {
                            if v.len() == 2 {
                                self.name = Some(v[1].to_owned());
                            } else {
                                ctx.text("Usename is required!")
                            }
                        }
                        _ => ctx.text(format!("unknown operation: {m:?}"))
                    }
                } else {
                    let msg = data_json.unwrap().value;

                    let chat_msg = ChatMessage {
                        chat_type: ChatType::TEXT,
                        value: msg,
                        id: self.id,
                        room_id: room_id.to_string(),
                        user_id: String::new(),
                    };
                    let msg = serde_json::to_string(&chat_msg).unwrap();
                    self.addr.do_send(server::ClientMessage{
                        id: self.id,
                        msg,
                        room: self.room.clone(),
                    })
                }
            }
            ws::Message::Binary(_) => println!("Unsupported binary"),
            ws::Message::Close(reason) => {
                ctx.close(reason);
                ctx.stop();
            }
            ws::Message::Continuation(_) => {
                ctx.stop();
            }
            ws::Message::Nop => (),
        }
    }
}

impl WsChatSession {
    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARBET, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                act.addr.do_send(server::Disconnect {id: act.id });
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
}
