-- INSERT INTO user_details (card_id, name) VALUES (1, 'sally');
-- INSERT INTO user_details (card_id, name) VALUES (2, 'bill');
-- INSERT INTO user_details (card_id, name) VALUES (3, 'jill');
-- INSERT INTO user_details (card_id, name) VALUES (4, 'sam');
-- INSERT INTO user_details (card_id, name) VALUES (5, 'toby');

INSERT INTO T001USER_DETAILS (CARD_ID, EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, MOBILE_NO, DATE_OF_REG) VALUES (12345, 01, 'Sally', 'Brooks', 'sallybrooks@email.com', '01234567890', '2020-01-01');
INSERT INTO T002USER_AUTH (CARD_ID, PIN, STATUS, ATTEMPTS) VALUES (12345, 1234, 'ACTIVE', 0);