package command

import (
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/spf13/cobra"
)

var logoutCmd = &cobra.Command{
	Use:   "logout",
	Short: "Log out and clear saved credentials",
	RunE: func(cmd *cobra.Command, args []string) error {
		if err := config.ClearCredentials(); err != nil {
			output.Error("Failed to clear credentials: %s", err)
			return nil
		}
		output.Success("Logged out successfully")
		return nil
	},
}
