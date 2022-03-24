package model

import "database/sql"

type User struct {
	UserID int64
	Login  string
	Email  string
}

type UserMapper struct {
	db *sql.DB
}

func NewUserMapper(db *sql.DB) *UserMapper {
	return &UserMapper{db}
}

func (um *UserMapper) Save(u *User) error {
	_, err := um.db.Exec(`INSERT INTO users (user_id, login, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE login = VALUES(login), email = VALUES(email)`, u.UserID, u.Login, u.Email)
	if err != nil {
		return err
	}

	return nil
}

func (um *UserMapper) GetDebugUser() *User {
	return &User{
		UserID: 1,
		Login:  "debug",
		Email:  "fake@example.com",
	}
}
