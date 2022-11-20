use std::time::{Duration, Instant};

use actix::prelude::*;
use actix_web_actors::ws;
use serde::Serialize;

use crate::server;

const HEARBET: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Debug)]
pub struct WsChatSession {
    pub id: usize,
    pub hb: Instant,
    pub room: String,
    pub name: Option<String>,
    pub addr: Addr<server::ChatServer>,
}

#[derive(Serialize)]
pub enum ChatType {
    STATUS,
    TYPING,
    TEXT,
    CONNECT,
    DISCONNECT,
}

#[derive(Serialize)]
struct ChatMessage {
    pub chat_type: ChatType,
    pub value: Vec<String>,
    pub id: usize,
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
                let m = text.trim();
                if m.starts_with("/") {
                    let v: Vec<&str> = m.splitn(2, ' ').collect();
                    match v[0] {
                        "/list" => {
                            self.addr
                                .send(server::ListRooms)
                                .into_actor(self)
                                .then(|res, _, ctx| {
                                    match res {
                                        Ok(rooms) => {
                                            let chat_msg = ChatMessage {
                                                chat_type: ChatType::STATUS,
                                                value: rooms,
                                                id: 0,
                                            };
                                            let msg = serde_json::to_string(&chat_msg).unwrap();
                                            ctx.text(msg);
                                        }
                                        _ => println!("Failed to send message")
                                    }
                                    fut::ready(())
                                })
                                .wait(ctx)
                        }
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
                                let mut chat_msg = ChatMessage {
                                    chat_type: ChatType::TYPING,
                                    value: vec![],
                                    id: self.id,
                                };
                                if v[1] == "in" {
                                    chat_msg.value = vec!["in".to_string()];
                                } else {
                                    chat_msg.value = vec!["out".to_string()];
                                }
                                let msg = serde_json::to_string(&chat_msg).unwrap();
                                self.addr.do_send(server::ClientMessage{
                                    id: self.id,
                                    msg,
                                    room: self.room.clone(),
                                })
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
                    let msg = if let Some(ref name) = self.name {
                        format!("{name}: {m}")
                    } else {
                        m.to_owned()
                    };

                    let chat_msg = ChatMessage {
                        chat_type: ChatType::TEXT,
                        value: vec![msg],
                        id: self.id,
                    };
                    let msg = serde_json::to_string(&chat_msg).unwrap();
                    println!("{msg}");

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