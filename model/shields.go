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

func (sm *ShieldMapper) GetFromUserIDAndID(userID, id int64) (*Shield, error) {
	sh := &Shield{}

	row := sm.db.QueryRow("SELECT s.shield_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.user_id = ? AND s.shield_id = ?", userID, id)
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

func (sm *ShieldMapper) GetFromUserID(userID int64) ([]*Shield, error) {
	out := []*Shield{}

	rows, err := sm.db.Query("SELECT s.shield_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.user_id = ?", userID)
	if err != nil {
		return out, err
	}
	defer rows.Close()

	for rows.Next() {
		sh := &Shield{}
		err := rows.Scan(&sh.ShieldID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret)
		if err != nil {
			return out, err
		}

		out = append(out, sh)
	}

	return out, nil
}

func (sm *ShieldMapper) Save(n *Shield) error {
	success := false

	tx, err := sm.db.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if success {
			tx.Commit()
		} else {
			tx.Rollback()
		}
	}()

	if n.ShieldID > 0 {
		_, err = tx.Exec("UPDATE shields SET user_id=?, name=?, title=?, text=?, color=?, secret=? WHERE shield_id = ?",
			n.UserID, n.Name, n.Title, n.Text, n.Color, n.Secret, n.ShieldID)
		if err != nil {
			return err
		}
	} else {
		res, err := tx.Exec("INSERT INTO shields (user_id, name, title, text, color, secret) VALUES (?,?,?,?,?,?)",
			n.UserID, n.Name, n.Title, n.Text, n.Color, n.Secret)
		if err != nil {
			return err
		}

		i, err := res.LastInsertId()
		if err != nil {
			return err
		}

		n.ShieldID = i
	}

	success = true

	return nil
}

func (sm *ShieldMapper) Delete(n *Shield) error {
	success := false
	tx, err := sm.db.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if success {
			tx.Commit()
		} else {
			tx.Rollback()
		}
	}()

	_, err = tx.Exec("DELETE FROM shields WHERE shield_id = ?", n.ShieldID)
	if err != nil {
		return err
	}

	success = true

	return nil
}
