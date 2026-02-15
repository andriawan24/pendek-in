package command

import (
	"fmt"

	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/charmbracelet/huh"
	"github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
	Use:   "delete <link-id>",
	Short: "Delete a shortened URL",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		linkID := args[0]
		force, _ := cmd.Flags().GetBool("force")

		c := client.New()

		// Fetch link details for confirmation
		link, err := c.GetLink(linkID)
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		if !force {
			var confirm bool
			err := huh.NewConfirm().
				Title(fmt.Sprintf("Delete link %s (%s)?", link.ShortCode, output.Truncate(link.OriginalURL, 40))).
				Affirmative("Yes, delete it").
				Negative("Cancel").
				Value(&confirm).
				Run()
			if err != nil {
				return err
			}
			if !confirm {
				output.Warn("Cancelled")
				return nil
			}
		}

		if err := c.DeleteLink(linkID); err != nil {
			output.Error("%s", err)
			return nil
		}

		output.Success("Link %s deleted", output.Bold(link.ShortCode))
		return nil
	},
}

func init() {
	deleteCmd.Flags().BoolP("force", "f", false, "Skip confirmation prompt")
}
