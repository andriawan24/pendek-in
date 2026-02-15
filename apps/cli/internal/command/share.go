package command

import (
	"fmt"

	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/atotto/clipboard"
	"github.com/spf13/cobra"
)

var shareCmd = &cobra.Command{
	Use:   "share <short-code>",
	Short: "Copy a shortened URL to clipboard",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		code := args[0]

		c := client.New()
		links, err := c.ListLinks()
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		var found *client.LinkResponse
		for i, link := range links {
			if link.ShortCode == code || (link.CustomShortCode != nil && *link.CustomShortCode == code) {
				found = &links[i]
				break
			}
		}

		if found == nil {
			output.Error("Link with code %s not found", output.Bold(code))
			return nil
		}

		shortURL := fmt.Sprintf("%s/%s", config.APPURL(), found.ShortCode)

		if err := clipboard.WriteAll(shortURL); err != nil {
			output.Error("Failed to copy to clipboard: %s", err)
			fmt.Println(shortURL)
			return nil
		}

		output.Success("Copied to clipboard: %s", output.Bold(shortURL))
		return nil
	},
}
