CREATE TABLE user_details (
  card_id   VARCHAR(16)     PRIMARY KEY,
  name      VARCHAR(80)
);


CREATE TABLE user_auth (
  card_id   VARCHAR(16)     PRIMARY KEY
);


CREATE TABLE balance (
  card_id   VARCHAR(16)     PRIMARY KEY
);


CREATE TABLE payment_history (
  card_id   VARCHAR(16)     PRIMARY KEY
);


ALTER TABLE user_details OWNER TO postgres;
ALTER TABLE user_auth OWNER TO postgres;
ALTER TABLE balance OWNER TO postgres;
ALTER TABLE payment_history OWNER TO postgres;