package model

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"errors"
	"strings"
	"time"
	"unicode/utf8"
)

const (
	MaxUserAPITokenDescriptionLength = 255
	UserAPITokenPrefix               = "sdu_"
)

var (
	ErrUserAPITokenDescriptionRequired = errors.New("API token description is required")
	ErrUserAPITokenDescriptionTooLong  = errors.New("API token description is too long")
)

// UserAPIToken is the metadata shown to its owner. Token hashes and plaintext
// token values are deliberately excluded from this type.
type UserAPIToken struct {
	APITokenID  int64
	UserID      int64
	Description string
	Created     time.Time
	LastUsed    *time.Time
}

type UserAPITokenMapper struct {
	db *sql.DB
}

func NewUserAPITokenMapper(db *sql.DB) *UserAPITokenMapper {
	return &UserAPITokenMapper{db: db}
}

func (tm *UserAPITokenMapper) GetFromUserID(userID int64) ([]*UserAPIToken, error) {
	rows, err := tm.db.Query(`SELECT api_token_id, user_id, description, stamp_created, stamp_last_used FROM user_api_tokens WHERE user_id = ? ORDER BY stamp_created DESC, api_token_id DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tokens := []*UserAPIToken{}
	for rows.Next() {
		token, err := scanUserAPIToken(rows)
		if err != nil {
			return nil, err
		}
		tokens = append(tokens, token)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tokens, nil
}

func (tm *UserAPITokenMapper) GetFromUserIDAndID(userID, apiTokenID int64) (*UserAPIToken, error) {
	row := tm.db.QueryRow(`SELECT api_token_id, user_id, description, stamp_created, stamp_last_used FROM user_api_tokens WHERE user_id = ? AND api_token_id = ?`, userID, apiTokenID)
	token, err := scanUserAPIToken(row)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return token, nil
}

// Create returns the public metadata and the plaintext user token. The
// plaintext token is never stored and must be shown to the owner only now.
func (tm *UserAPITokenMapper) Create(userID int64, description string) (*UserAPIToken, string, error) {
	description, err := normalizeUserAPITokenDescription(description)
	if err != nil {
		return nil, "", err
	}

	plainToken, tokenHash, err := newUserAPITokenSecret()
	if err != nil {
		return nil, "", err
	}

	result, err := tm.db.Exec(`INSERT INTO user_api_tokens (user_id, description, token_hash) VALUES (?, ?, ?)`, userID, description, tokenHash[:])
	if err != nil {
		return nil, "", err
	}

	apiTokenID, err := result.LastInsertId()
	if err != nil {
		return nil, "", err
	}

	token, err := tm.GetFromUserIDAndID(userID, apiTokenID)
	if err != nil {
		return nil, "", err
	}
	if token == nil {
		return nil, "", errors.New("created API token was not found")
	}

	return token, plainToken, nil
}

func (tm *UserAPITokenMapper) DeleteFromUserIDAndID(userID, apiTokenID int64) error {
	_, err := tm.db.Exec(`DELETE FROM user_api_tokens WHERE user_id = ? AND api_token_id = ?`, userID, apiTokenID)
	return err
}

// GetFromToken finds a token from its plaintext value without exposing
// its stored hash to callers.
func (tm *UserAPITokenMapper) GetFromToken(plainToken string) (*UserAPIToken, error) {
	tokenHash := sha256.Sum256([]byte(plainToken))
	row := tm.db.QueryRow(`SELECT api_token_id, user_id, description, stamp_created, stamp_last_used FROM user_api_tokens WHERE token_hash = ?`, tokenHash[:])
	token, err := scanUserAPIToken(row)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return token, nil
}

func (tm *UserAPITokenMapper) MarkUsed(apiTokenID int64) error {
	_, err := tm.db.Exec(`UPDATE user_api_tokens SET stamp_last_used = CURRENT_TIMESTAMP() WHERE api_token_id = ?`, apiTokenID)
	return err
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanUserAPIToken(row rowScanner) (*UserAPIToken, error) {
	token := &UserAPIToken{}
	lastUsed := sql.NullTime{}
	err := row.Scan(&token.APITokenID, &token.UserID, &token.Description, &token.Created, &lastUsed)
	if err != nil {
		return nil, err
	}
	if lastUsed.Valid {
		value := lastUsed.Time
		token.LastUsed = &value
	}

	return token, nil
}

func normalizeUserAPITokenDescription(description string) (string, error) {
	description = strings.TrimSpace(description)
	if description == "" {
		return "", ErrUserAPITokenDescriptionRequired
	}
	if utf8.RuneCountInString(description) > MaxUserAPITokenDescriptionLength {
		return "", ErrUserAPITokenDescriptionTooLong
	}

	return description, nil
}

func newUserAPITokenSecret() (string, [sha256.Size]byte, error) {
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		return "", [sha256.Size]byte{}, err
	}

	plainToken := UserAPITokenPrefix + base64.RawURLEncoding.EncodeToString(secret)
	return plainToken, sha256.Sum256([]byte(plainToken)), nil
}

func IsUserAPIToken(plainToken string) bool {
	return strings.HasPrefix(plainToken, UserAPITokenPrefix)
}
