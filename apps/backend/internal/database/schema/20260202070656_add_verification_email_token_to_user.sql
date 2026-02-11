-- +goose Up
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN verified_at TIMESTAMPTZ;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN verification_token;
ALTER TABLE users DROP COLUMN verified_at;
-- +goose StatementEnd
