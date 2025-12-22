CREATE TABLE archive_image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    archive_id BIGINT NOT NULL,
    storage_key VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    extension VARCHAR(5) NOT NULL,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
);
