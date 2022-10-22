package model

import (
	"database/sql"
	"errors"
	"math/rand"
	"sync"
	"time"
)

type Shield struct {
	ShieldID int64
	PublicID string
	UserID   int64

	Name string

	Title string
	Text  string
	Color string

	Secret string
}

type ShieldMapper struct {
	publicIDGenerator *PublicIDGenerator

	db *sql.DB
}

func NewShieldMapper(db *sql.DB) *ShieldMapper {
	return &ShieldMapper{
		publicIDGenerator: &PublicIDGenerator{
			length: 3,
			db:     db,
		},
		db: db,
	}
}

var ErrShieldQuotaBlown = errors.New("Shield Quota Suprassed")

func (sm *ShieldMapper) New(userID int64) (*Shield, error) {
	return nil, ErrShieldQuotaBlown
}

func (sm *ShieldMapper) GetFromID(id int64) (*Shield, error) {
	sh := &Shield{}

	row := sm.db.QueryRow("SELECT s.shield_id, s.public_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.shield_id = ?", id)
	switch err := row.Scan(&sh.ShieldID, &sh.PublicID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return sh, nil
	default:
		return nil, err
	}
}

func (sm *ShieldMapper) GetFromPublicID(publicID string) (*Shield, error) {
	sh := &Shield{}

	row := sm.db.QueryRow("SELECT s.shield_id, s.public_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.public_id = ?", publicID)
	switch err := row.Scan(&sh.ShieldID, &sh.PublicID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret); err {
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

	row := sm.db.QueryRow("SELECT s.shield_id, s.public_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.user_id = ? AND s.shield_id = ?", userID, id)
	switch err := row.Scan(&sh.ShieldID, &sh.PublicID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret); err {
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

	row := sm.db.QueryRow("SELECT s.shield_id, s.public_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.secret = ?", secret)
	switch err := row.Scan(&sh.ShieldID, &sh.PublicID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret); err {
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

	rows, err := sm.db.Query("SELECT s.shield_id, s.public_id, s.user_id, s.name, s.title, s.text, s.color, s.secret FROM shields AS s WHERE s.user_id = ?", userID)
	if err != nil {
		return out, err
	}
	defer rows.Close()

	for rows.Next() {
		sh := &Shield{}
		err := rows.Scan(&sh.ShieldID, &sh.PublicID, &sh.UserID, &sh.Name, &sh.Title, &sh.Text, &sh.Color, &sh.Secret)
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
		p, err := sm.publicIDGenerator.GetNewPublicID()
		if err != nil {
			return err
		}
		n.PublicID = p
		res, err := tx.Exec("INSERT INTO shields (public_id, user_id, name, title, text, color, secret) VALUES (?,?,?,?,?,?,?)",
			n.PublicID, n.UserID, n.Name, n.Title, n.Text, n.Color, n.Secret)
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

type PublicIDGenerator struct {
	length int
	db     *sql.DB

	sync.Mutex
}

func (pig *PublicIDGenerator) GetNewPublicID() (string, error) {
	pig.Lock()
	defer pig.Unlock()

generate:
	for {
		stringWithCharset := stringWithCharset(pig.length, "abcdefghjkmnpqrstuvwxyz23456789")
		rows, err := pig.db.Query(`SELECT 1 FROM shields WHERE public_id = ?`, stringWithCharset)
		if err != nil {
			return "", err
		}
		defer rows.Close()

		for rows.Next() {
			pig.length++
			continue generate
		}

		return stringWithCharset, nil
	}
}

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

func stringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}
