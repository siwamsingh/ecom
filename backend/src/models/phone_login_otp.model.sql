
CREATE TABLE "phone_login_otp"(
  phone_number VARCHAR(15) PRIMARY KEY,
  otp VARCHAR(255),
  token VARCHAR(455),
  attempt_count SMALLINT,
  last_request_time TIMESTAMP,
  ip_address VARCHAR(45)
);