package services

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/andriawan24/link-short/internal/utils"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type StorageService interface {
	Upload(ctx context.Context, key string, body io.Reader, contentType string) (string, error)
	Delete(ctx context.Context, key string) error
	// GetPresignedURL generates a time-limited signed URL for accessing a private object.
	// Returns the original value unchanged if it looks like an external URL (e.g. Google avatar).
	GetPresignedURL(ctx context.Context, key string) (string, error)
}

type garageStoreService struct {
	client        *s3.Client
	presignClient *s3.PresignClient
	bucket        string
}

func NewStorageService() (StorageService, error) {
	endpoint := utils.GetEnv("GARAGE_ENDPOINT", "http://127.0.0.1:3900")
	region := utils.GetEnv("GARAGE_REGION", "garage")
	accessKeyId := utils.GetEnv("GARAGE_ACCESS_KEY_ID", "garage")
	accessKey := utils.GetEnv("GARAGE_ACCESS_KEY", "garage")
	bucket := utils.GetEnv("GARAGE_BUCKET", "pendek-in-bucket")

	if accessKey == "" || accessKeyId == "" {
		return nil, fmt.Errorf("GARAGE_ACCESS_KEY and GARAGE_ACCESS_KEY_ID are missing from .env")
	}

	client := s3.New(s3.Options{
		Region:       region,
		BaseEndpoint: aws.String(endpoint),
		Credentials:  credentials.NewStaticCredentialsProvider(accessKeyId, accessKey, ""),
		UsePathStyle: true,
	})

	return &garageStoreService{
		client:        client,
		presignClient: s3.NewPresignClient(client),
		bucket:        bucket,
	}, nil
}

func (s *garageStoreService) Upload(ctx context.Context, key string, body io.Reader, contentType string) (string, error) {
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        body,
		ContentType: aws.String(contentType),
	})

	if err != nil {
		return "", fmt.Errorf("failed to upload: %w", err)
	}

	return key, nil
}

func (s *garageStoreService) Delete(ctx context.Context, key string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	return err
}

const presignExpiry = 1 * time.Hour

func (s *garageStoreService) GetPresignedURL(ctx context.Context, key string) (string, error) {
	if key == "" {
		return "", nil
	}

	// External URLs (e.g. Google avatar) don't need signing.
	if strings.HasPrefix(key, "http://") || strings.HasPrefix(key, "https://") {
		return key, nil
	}

	req, err := s.presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(presignExpiry))
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return req.URL, nil
}