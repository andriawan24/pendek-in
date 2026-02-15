package command

import (
	"os"

	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "pendek",
	Short: "Pendek.in CLI - URL shortener from your terminal",
	Long:  "A command-line interface for Pendek.in URL shortener service.\nShorten URLs, manage links, and view analytics.",
}

func Execute() {
	config.Init(rootCmd)

	rootCmd.AddCommand(versionCmd)
	rootCmd.AddCommand(loginCmd)
	rootCmd.AddCommand(logoutCmd)
	rootCmd.AddCommand(whoamiCmd)
	rootCmd.AddCommand(shortenCmd)
	rootCmd.AddCommand(listCmd)
	rootCmd.AddCommand(statsCmd)
	rootCmd.AddCommand(deleteCmd)
	rootCmd.AddCommand(shareCmd)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
