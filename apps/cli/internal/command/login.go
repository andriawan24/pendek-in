package command

import (
	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/charmbracelet/huh"
	"github.com/spf13/cobra"
)

var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Authenticate with your Pendek.in account",
	RunE: func(cmd *cobra.Command, args []string) error {
		var email, password string

		form := huh.NewForm(
			huh.NewGroup(
				huh.NewInput().
					Title("Email").
					Value(&email),
				huh.NewInput().
					Title("Password").
					EchoMode(huh.EchoModePassword).
					Value(&password),
			),
		)

		if err := form.Run(); err != nil {
			return err
		}

		c := client.New()
		resp, err := c.Login(email, password)
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		if err := config.SaveCredentials(&config.Credentials{
			AccessToken:           resp.Token,
			RefreshToken:          resp.RefreshToken,
			AccessTokenExpiresAt:  resp.TokenExpiredAt,
			RefreshTokenExpiresAt: resp.RefreshTokenExpiredAt,
		}); err != nil {
			output.Error("Failed to save credentials: %s", err)
			return nil
		}

		output.Success("Logged in as %s (%s)", output.Bold(resp.User.Name), resp.User.Email)
		return nil
	},
}
