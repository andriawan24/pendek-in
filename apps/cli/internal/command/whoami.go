package command

import (
	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/spf13/cobra"
)

var whoamiCmd = &cobra.Command{
	Use:   "whoami",
	Short: "Show current authenticated user",
	RunE: func(cmd *cobra.Command, args []string) error {
		c := client.New()
		user, err := c.GetProfile()
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		if config.JSONOutput() {
			return output.PrintJSON(user)
		}

		output.Success("Logged in as %s", output.Bold(user.Name))
		output.PrintTable(
			[]string{"Field", "Value"},
			[][]string{
				{"Name", user.Name},
				{"Email", user.Email},
				{"Verified", boolToStr(user.IsVerified)},
			},
		)
		return nil
	},
}

func boolToStr(b bool) string {
	if b {
		return "Yes"
	}
	return "No"
}
