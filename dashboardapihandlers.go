package shieldeddotdev

import (
	cryptorand "crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"math/big"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

var shieldKeyPattern = regexp.MustCompile(`^[a-z0-9-]{5,64}$`)

func validShieldKey(shieldKey string) bool {
	return shieldKey == "" || shieldKeyPattern.MatchString(shieldKey)
}

func shieldKeyAvailable(sm *model.ShieldMapper, userID, shieldID int64, shieldKey string) (bool, error) {
	if shieldKey == "" {
		return true, nil
	}

	shield, err := sm.GetFromUserIDAndShieldKey(userID, shieldKey)
	if err != nil {
		return false, err
	}

	return shield == nil || shield.ShieldID == shieldID, nil
}

func shieldKeyInUseError(err error) bool {
	var mysqlErr *mysql.MySQLError
	return errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 && strings.Contains(mysqlErr.Message, "unq_shields_shield_key")
}

type DashboardShieldApiIndexHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewDashboardShieldApiIndexHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *DashboardShieldApiIndexHandler {
	return &DashboardShieldApiIndexHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (sh *DashboardShieldApiIndexHandler) HandleGET(w http.ResponseWriter, r *http.Request) {
	id := sh.jwtAuth.GetAuth(r)
	if id == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	shields, err := sh.sm.GetFromUserID(*id)
	if err != nil {
		slog.Error("error fetching shields", slog.Any("error", err), slog.Any("id", *id))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	enc := json.NewEncoder(w)
	err = enc.Encode(shields)
	if err != nil {
		slog.Error("error encoding shields", slog.Any("error", err))
	}
}

func (sh *DashboardShieldApiIndexHandler) HandlePOST(w http.ResponseWriter, r *http.Request) {
	id := sh.jwtAuth.GetAuth(r)
	if id == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	postShield := &model.Shield{}

	jd := json.NewDecoder(r.Body)
	err := jd.Decode(postShield)
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest)
		return
	}
	if !validShieldKey(postShield.ShieldKey) {
		http.Error(w, "shield key must be 5-64 lowercase letters, digits, or hyphens", http.StatusBadRequest)
		return
	}
	available, err := shieldKeyAvailable(sh.sm, *id, 0, postShield.ShieldKey)
	if err != nil {
		slog.Error("error checking shield key", slog.Any("error", err), slog.Any("id", *id))
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	if !available {
		http.Error(w, "shield key is already in use", http.StatusConflict)
		return
	}

	uu, err := secureStringWithCharset(40, "abcdefghjkmnpqrstuvwxyz23456789")
	if err != nil {
		slog.Error("error generating shield secret", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	cleanShield := &model.Shield{
		UserID: *id,

		ShieldKey: postShield.ShieldKey,
		Name:      postShield.Name,

		Title: postShield.Title,
		Text:  postShield.Text,
		Color: postShield.Color,

		Secret: uu,
	}

	err = sh.sm.Save(cleanShield)
	if shieldKeyInUseError(err) {
		http.Error(w, "shield key is already in use", http.StatusConflict)
		return
	}
	if err != nil {
		slog.Error("error saving shield", slog.Any("error", err))
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("/api/shields/%d", cleanShield.ShieldID))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	x := json.NewEncoder(w)
	x.Encode(cleanShield)
}

func secureStringWithCharset(length int, charset string) (string, error) {
	b := make([]byte, length)
	limit := big.NewInt(int64(len(charset)))
	for i := range b {
		index, err := cryptorand.Int(cryptorand.Reader, limit)
		if err != nil {
			return "", err
		}
		b[i] = charset[index.Int64()]
	}
	return string(b), nil
}

type DashboardShieldApiHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewDashboardShieldApiHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *DashboardShieldApiHandler {
	return &DashboardShieldApiHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (dh *DashboardShieldApiHandler) shieldSetup(w http.ResponseWriter, r *http.Request) *model.Shield {
	uid := dh.jwtAuth.GetAuth(r)
	if uid == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return nil
	}

	vars := mux.Vars(r)
	id, suc := vars["id"]
	if !suc {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return nil
	}

	nid, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return nil
	}

	shield, err := dh.sm.GetFromUserIDAndID(*uid, nid)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return nil
	}

	if shield == nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return nil
	}

	return shield
}

func (dh *DashboardShieldApiHandler) HandlePUT(w http.ResponseWriter, r *http.Request) {
	shield := dh.shieldSetup(w, r)
	if shield == nil {
		return
	}

	putShield := &model.Shield{}
	jd := json.NewDecoder(r.Body)
	err := jd.Decode(putShield)
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest)
		return
	}
	if !validShieldKey(putShield.ShieldKey) {
		http.Error(w, "shield key must be 5-64 lowercase letters, digits, or hyphens", http.StatusBadRequest)
		return
	}
	available, err := shieldKeyAvailable(dh.sm, shield.UserID, shield.ShieldID, putShield.ShieldKey)
	if err != nil {
		slog.Error("error checking shield key", slog.Any("error", err), slog.Any("id", shield.UserID))
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	if !available {
		http.Error(w, "shield key is already in use", http.StatusConflict)
		return
	}

	shield.ShieldKey = putShield.ShieldKey
	shield.Name = putShield.Name

	shield.Title = putShield.Title
	shield.Text = putShield.Text
	shield.Color = putShield.Color

	err = dh.sm.Save(shield)
	if shieldKeyInUseError(err) {
		http.Error(w, "shield key is already in use", http.StatusConflict)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	x := json.NewEncoder(w)
	x.Encode(shield)
}

func (sah *DashboardShieldApiHandler) HandleDELETE(w http.ResponseWriter, r *http.Request) {
	shield := sah.shieldSetup(w, r)
	if shield == nil {
		return
	}

	err := sah.sm.Delete(shield)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
