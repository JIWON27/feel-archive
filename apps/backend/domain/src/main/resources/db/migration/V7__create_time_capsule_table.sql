CREATE TABLE time_capsule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    emotion VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    location_label VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'LOCKED',
    is_notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
    open_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME
);
