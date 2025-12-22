CREATE TABLE archive (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    emotion VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    visibility VARCHAR(7) NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    location_label VARCHAR(100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME
);
