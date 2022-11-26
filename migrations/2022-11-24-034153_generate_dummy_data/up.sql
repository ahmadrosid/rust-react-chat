-- Your SQL goes here
INSERT INTO users(id, username, phone, created_at) 
VALUES
("4fbd288c-d3b2-4f78-adcf-def976902d50","Ahmad Rosid","123","2022-11-23T07:56:30.214162+00:00"),
("1e9a12c1-e98c-4a83-a55a-32cc548a169d","Ashley Young","345","2022-11-23T07:56:30.214162+00:00"),
("1bc833808-05ed-455a-9d26-64fe1d96d62d","Charles Edward","678","2022-12-23T07:56:30.214162+00:00");

INSERT INTO rooms(id, name, last_message, participant_ids, created_at)
VALUES
("f061383b-0393-4ce8-9a85-f31d03762263", "Charles Edward", "Hi, how are you?", "1e9a12c1-e98c-4a83-a55a-32cc548a169d,1bc833808-05ed-455a-9d26-64fe1d96d62d", "2022-12-23T07:56:30.214162+00:00"),
("008e9dc4-f01d-4429-ba31-986d7e63cce8", "Ahmad Rosid", "Hi... are free today?", "1e9a12c1-e98c-4a83-a55a-32cc548a169d,1bc833808-05ed-455a-9d26-64fe1d96d62d", "2022-12-23T07:56:30.214162+00:00");

INSERT INTO conversations(id, user_id, room_id, content, created_at)
VALUES
("9aeab1a7-e063-40d1-a120-1f7585fa47d6", "1bc833808-05ed-455a-9d26-64fe1d96d62d", "f061383b-0393-4ce8-9a85-f31d03762263", "Hello", "2022-12-23T07:56:30.214162+00:00"),
("f4e54e70-736b-4a79-a622-3659b0b555e8", "1e9a12c1-e98c-4a83-a55a-32cc548a169d", "f061383b-0393-4ce8-9a85-f31d03762263", "Hi, how are you?", "2022-12-23T07:56:30.214162+00:00"),
("d3ea6e39-ed58-4613-8922-b78f14a2676a", "1bc833808-05ed-455a-9d26-64fe1d96d62d", "008e9dc4-f01d-4429-ba31-986d7e63cce8", "Hi... are free today?", "2022-12-23T07:56:30.214162+00:00");
