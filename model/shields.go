package model

import (
	"database/sql"
	"errors"
)

type Shield struct {
	ShieldID int64
	UserID   int64

	Name string

	Title string
	Text  string
	Color string

	Secret string
}

type ShieldMapper struct {
	db *sql.DB
}

func NewShieldMapper(db *sql.DB) *ShieldMapper {
	return &ShieldMapper{db}
}

var ErrShieldQuotaBlown = errors.New("Shield Quota Suprassed")

func (sm *ShieldMapper) New(userID int64) (*Shield, error) {
	return nil, ErrShieldQuotaBlown
}

func (sm *ShieldMapper) GetFromID(id int64) (*Shield, error) {
	sh := &Shield{}

	row := sm.db.QueryRow("SELECT s.shield_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.shield_id = ?", id)
	switch err := row.Scan(&sh.ShieldID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return sh, nil
	default:
		return nil, err
	}
}

func (sm *ShieldMapper) GetFromSecret(secret string) (*Shield, error) {
	sh := &Shield{}

	row := sm.db.QueryRow("SELECT s.shield_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.secret = ?", secret)
	switch err := row.Scan(&sh.ShieldID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return sh, nil
	default:
		return nil, err
	}
}
