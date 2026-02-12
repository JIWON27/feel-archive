ALTER TABLE archive
ADD COLUMN location POINT
AS (ST_GeomFromText(CONCAT('POINT(',latitude, ' ',longitude, ')'), 4326))
STORED
NOT NULL;
