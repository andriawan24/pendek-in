package services

import (
	"context"
	"database/sql"

	"github.com/andriawan24/link-short/internal/database"
	"github.com/google/uuid"
)

type userService struct {
	queries *database.Queries
}

type UserService interface {
	GetUserByID(ctx context.Context, id uuid.UUID) (database.User, error)
	GetUserByToken(ctx context.Context, token string) (database.User, error)
	FindUserByEmail(ctx context.Context, email string) (database.User, error)
	FindUserByGoogleID(ctx context.Context, googleID string) (database.User, error)
	InsertUser(ctx context.Context, param database.InsertUserParams) (database.User, error)
	InsertUserWithGoogle(ctx context.Context, param database.InsertUserWithGoogleParams) (database.User, error)
	UpdateUser(ctx context.Context, param database.UpdateUserParams) (database.User, error)
	VerifyUser(ctx context.Context, id uuid.UUID) (database.User, error)
	LinkGoogleToUser(ctx context.Context, param database.LinkGoogleToUserParams) (database.User, error)
	UpdateVerificationToken(ctx context.Context, param database.UpdateVerificationTokenParams) (database.User, error)
}

func NewUserService(queries *database.Queries) UserService {
	return &userService{
		queries: queries,
	}
}

func (s *userService) GetUserByID(ctx context.Context, id uuid.UUID) (database.User, error) {
	var user database.User

	user, err := s.queries.GetUser(ctx, id)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (s *userService) GetUserByToken(ctx context.Context, token string) (database.User, error) {
	var user database.User

	param := sql.NullString{Valid: true, String: token}
	user, err := s.queries.GetUserByToken(ctx, param)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (s *userService) FindUserByEmail(ctx context.Context, email string) (database.User, error) {
	var user database.User

	user, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (s *userService) InsertUser(ctx context.Context, param database.InsertUserParams) (database.User, error) {
	newUser, err := s.queries.InsertUser(ctx, param)
	if err != nil {
		return newUser, err
	}

	return newUser, nil
}

func (s *userService) UpdateUser(ctx context.Context, param database.UpdateUserParams) (database.User, error) {
	updatedUser, err := s.queries.UpdateUser(ctx, param)
	if err != nil {
		return updatedUser, err
	}

	return updatedUser, nil
}

func (s *userService) FindUserByGoogleID(ctx context.Context, googleID string) (database.User, error) {
	user, err := s.queries.GetUserByGoogleID(ctx, sql.NullString{String: googleID, Valid: true})
	if err != nil {
		return user, err
	}

	return user, nil
}

func (s *userService) InsertUserWithGoogle(ctx context.Context, param database.InsertUserWithGoogleParams) (database.User, error) {
	newUser, err := s.queries.InsertUserWithGoogle(ctx, param)
	if err != nil {
		return newUser, err
	}

	return newUser, nil
}

func (s *userService) VerifyUser(ctx context.Context, id uuid.UUID) (database.User, error) {
	updatedUser, err := s.queries.VerifyUser(ctx, id)
	if err != nil {
		return updatedUser, err
	}

	return updatedUser, nil
}

func (s *userService) LinkGoogleToUser(ctx context.Context, param database.LinkGoogleToUserParams) (database.User, error) {
	updatedUser, err := s.queries.LinkGoogleToUser(ctx, param)
	if err != nil {
		return updatedUser, err
	}

	return updatedUser, nil
}

func (s *userService) UpdateVerificationToken(ctx context.Context, param database.UpdateVerificationTokenParams) (database.User, error) {
	updatedUser, err := s.queries.UpdateVerificationToken(ctx, param)
	if err != nil {
		return updatedUser, err
	}

	return updatedUser, nil
}