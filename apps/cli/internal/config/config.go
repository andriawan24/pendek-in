package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	DefaultAPIURL  = "http://localhost:8080"
	DefaultAPPURL  = "http://localhost:3000"
	configDirName  = "pendek-in"
)

func Init(rootCmd *cobra.Command) {
	_ = godotenv.Load()

	rootCmd.PersistentFlags().Bool("json", false, "Output in JSON format")
	rootCmd.PersistentFlags().Bool("no-color", false, "Disable colored output")

	_ = viper.BindPFlag("json", rootCmd.PersistentFlags().Lookup("json"))
	_ = viper.BindPFlag("no_color", rootCmd.PersistentFlags().Lookup("no-color"))
}

func ConfigDir() (string, error) {
	if dir := os.Getenv("PENDEK_CONFIG_DIR"); dir != "" {
		return dir, nil
	}
	base, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(base, configDirName), nil
}

func APIURL() string {
	if url := os.Getenv("PENDEK_API_URL"); url != "" {
		return url
	}
	return DefaultAPIURL
}

func APPURL() string {
	if url := os.Getenv("PENDEK_APP_URL"); url != "" {
		return url
	}
	return DefaultAPPURL
}

func JSONOutput() bool {
	if viper.GetBool("json") {
		return true
	}
	if value := os.Getenv("PENDEK_JSON"); value != "" {
		return getEnvBoolean(value, false)
	}
	return false
}

func getEnvBoolean(key string, fallback bool) bool {
	valueStr, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}

	valueBool, err := strconv.ParseBool(valueStr)
	if err != nil {
		fmt.Printf("Warning: Environment variable %s (%s) is not a valid boolean. Using default %t\n", key, valueStr, fallback)
		return fallback
	}
	return valueBool
}

