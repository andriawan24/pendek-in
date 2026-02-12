package utils

import (
	"context"
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/andriawan24/link-short/internal/models/responses"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func setupTestContext() (*gin.Context, *httptest.ResponseRecorder) {
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	return ctx, w
}

func TestRespondOK(t *testing.T) {
	ctx, w := setupTestContext()

	RespondOK(ctx, "success", gin.H{"key": "value"})

	assert.Equal(t, http.StatusOK, w.Code)

	var resp responses.BaseResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, "success", resp.Message)
	assert.NotNil(t, resp.Data)
}

func TestRespondJson(t *testing.T) {
	ctx, w := setupTestContext()

	ResponsdJson(ctx, http.StatusCreated, "created", gin.H{"id": 1})

	assert.Equal(t, http.StatusCreated, w.Code)

	var resp responses.BaseResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, "created", resp.Message)
}

func TestRespondUnauthorized(t *testing.T) {
	ctx, w := setupTestContext()

	RespondUnauthorized(ctx, "Unauthorized")

	assert.Equal(t, http.StatusUnauthorized, w.Code)

	var resp responses.ErrorResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, "Unauthorized", resp.Message)
}

func TestRespondBadRequest(t *testing.T) {
	ctx, w := setupTestContext()

	RespondBadRequest(ctx, "bad request")

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var resp responses.ErrorResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, "bad request", resp.Message)
}

func TestHandleErrorResponse(t *testing.T) {
	tests := []struct {
		name           string
		err            error
		expectedStatus int
		expectedMsg    string
	}{
		{
			name:           "context canceled",
			err:            context.Canceled,
			expectedStatus: http.StatusRequestTimeout,
			expectedMsg:    "request canceled",
		},
		{
			name:           "deadline exceeded",
			err:            context.DeadlineExceeded,
			expectedStatus: http.StatusGatewayTimeout,
			expectedMsg:    "request timeout",
		},
		{
			name:           "EOF",
			err:            io.EOF,
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "request body is required",
		},
		{
			name:           "json syntax error",
			err:            &json.SyntaxError{},
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "invalid JSON",
		},
		{
			name:           "json unmarshal type error",
			err:            &json.UnmarshalTypeError{},
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "invalid JSON field type",
		},
		{
			name:           "sql no rows",
			err:            sql.ErrNoRows,
			expectedStatus: http.StatusNotFound,
			expectedMsg:    "resource not found",
		},
		{
			name:           "pq unique violation",
			err:            &pq.Error{Code: "23505", Constraint: "users_email_key"},
			expectedStatus: http.StatusConflict,
			expectedMsg:    "duplicate resource",
		},
		{
			name:           "pq foreign key violation",
			err:            &pq.Error{Code: "23503", Constraint: "links_user_id_fkey"},
			expectedStatus: http.StatusConflict,
			expectedMsg:    "related resource not found",
		},
		{
			name:           "pq not null violation",
			err:            &pq.Error{Code: "23502", Column: "email"},
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "missing required field",
		},
		{
			name:           "pq check violation",
			err:            &pq.Error{Code: "23514", Constraint: "users_email_check"},
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "invalid field value",
		},
		{
			name:           "pq invalid text representation",
			err:            &pq.Error{Code: "22P02"},
			expectedStatus: http.StatusBadRequest,
			expectedMsg:    "invalid request parameter",
		},
		{
			name:           "pq unknown code",
			err:            &pq.Error{Code: "99999"},
			expectedStatus: http.StatusInternalServerError,
			expectedMsg:    "internal server error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx, w := setupTestContext()
			HandleErrorResponse(ctx, tt.err)

			assert.Equal(t, tt.expectedStatus, w.Code)

			var resp responses.ErrorResponse
			err := json.Unmarshal(w.Body.Bytes(), &resp)
			require.NoError(t, err)
			assert.Equal(t, tt.expectedMsg, resp.Message)
		})
	}
}

func TestHandleErrorResponse_ValidationErrors(t *testing.T) {
	type testStruct struct {
		Email    string `validate:"required,email"`
		Password string `validate:"required,min=8"`
	}

	v := validator.New()
	err := v.Struct(&testStruct{})
	require.Error(t, err)

	ctx, w := setupTestContext()
	HandleErrorResponse(ctx, err)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var resp responses.ErrorResponse
	jsonErr := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, jsonErr)
	assert.Equal(t, "validation error", resp.Message)
	assert.NotNil(t, resp.Error)
}
