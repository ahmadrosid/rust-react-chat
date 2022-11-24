use diesel::prelude::*;
use uuid::Uuid;

use crate::models::{User, Conversation};

type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn find_user_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<User>, DbError> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<User>(conn)
        .optional()?;

    Ok(user)
}

pub fn find_conversation_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Conversation>, DbError> {
    use crate::schema::conversations::dsl::*;

    let convo = conversations
        .filter(id.eq(uid.to_string()))
        .first::<Conversation>(conn)
        .optional()?;

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

use chrono::{DateTime, Utc};
use std::time::SystemTime;

fn iso_date() -> String {
    let now = SystemTime::now();
    let now: DateTime<Utc> = now.into();
    return now.to_rfc3339();
}

pub fn insert_new_user(
    conn: &mut SqliteConnection,
    nm: &str,
    pn: &str,
) -> Result<User, DbError> {
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
