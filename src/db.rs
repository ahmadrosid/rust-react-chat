use chrono::{DateTime, Utc};
use diesel::prelude::*;
use std::time::SystemTime;
use uuid::Uuid;

use crate::models::{Conversation, NewConversation, Room, User};

type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn find_user_by_uid(conn: &mut SqliteConnection, uid: Uuid) -> Result<Option<User>, DbError> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<User>(conn)
        .optional()?;

    Ok(user)
}

pub fn get_conversation_by_room_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Vec<Conversation>>, DbError> {
    use crate::schema::conversations;

    let convo = conversations::table
        .filter(conversations::room_id.eq(uid.to_string()))
        .load(conn)
        .optional()?;

    // for item in &convo.clone().unwrap() {
    //     println!("room_id:{}, user_id:{}", item.room_id, item.user_id);
    // }

    Ok(convo)
}

pub fn find_user_by_phone(
    conn: &mut SqliteConnection,
    user_phone: String,
) -> Result<Option<User>, DbError> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(phone.eq(user_phone))
        .first::<User>(conn)
        .optional()?;

    Ok(user)
}

pub fn get_all_rooms(conn: &mut SqliteConnection) -> Result<Vec<Room>, DbError> {
    use crate::schema::rooms;
    let rooms_data: Vec<Room> = rooms::table.get_results(conn)?;
    Ok(rooms_data)
}

fn iso_date() -> String {
    let now = SystemTime::now();
    let now: DateTime<Utc> = now.into();
    return now.to_rfc3339();
}

pub fn insert_new_user(conn: &mut SqliteConnection, nm: &str, pn: &str) -> Result<User, DbError> {
    use crate::schema::users::dsl::*;

    let new_user = User {
        id: Uuid::new_v4().to_string(),
        username: nm.to_owned(),
        phone: pn.to_owned(),
        created_at: iso_date(),
    };

    diesel::insert_into(users).values(&new_user).execute(conn)?;

    Ok(new_user)
}

pub fn insert_new_conversation(
    conn: &mut SqliteConnection,
    new: NewConversation,
) -> Result<Conversation, DbError> {
    use crate::schema::conversations::dsl::*;

    let new_conversation = Conversation {
        id: Uuid::new_v4().to_string(),
        user_id: new.user_id,
        room_id: new.room_id,
        content: new.message,
        created_at: iso_date(),
    };

    diesel::insert_into(conversations)
        .values(&new_conversation)
        .execute(conn)?;

    Ok(new_conversation)
}
