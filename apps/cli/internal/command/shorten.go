package command

import (
	"fmt"
	"time"

	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/atotto/clipboard"
	"github.com/charmbracelet/huh"
	"github.com/spf13/cobra"
)

var shortenCmd = &cobra.Command{
	Use:   "shorten <url>",
	Short: "Create a shortened URL",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		url := args[0]
		customCode, _ := cmd.Flags().GetString("custom")
		expiry, _ := cmd.Flags().GetString("expiry")

		req := client.CreateLinkRequest{
			OriginalURL: url,
		}

		if customCode != "" {
			req.CustomShortCode = &customCode
		}

		if expiry != "" {
			t, err := time.Parse(time.RFC3339, expiry)
			if err != nil {
				t, err = time.Parse("2006-01-02", expiry)
				if err != nil {
					output.Error("Invalid expiry format. Use RFC3339 (2025-12-31T23:59:59Z) or date (2025-12-31)")
					return nil
				}
			}
			req.ExpiredAt = &t
		}

		c := client.New()
		link, err := c.CreateLink(req)
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		if config.JSONOutput() {
			return output.PrintJSON(link)
		}

		shortURL := fmt.Sprintf("%s/%s", config.APPURL(), link.ShortCode)
		output.Success("URL shortened successfully!")
		fmt.Println()
		fmt.Printf("  %s  %s\n", output.Faint("Short URL:"), output.Bold(shortURL))
		fmt.Printf("  %s  %s\n", output.Faint("Original:"), output.Truncate(link.OriginalURL, 60))
		if link.CustomShortCode != nil {
			fmt.Printf("  %s  %s\n", output.Faint("Custom:"), *link.CustomShortCode)
		}
		if link.ExpiredAt != nil {
			fmt.Printf("  %s  %s\n", output.Faint("Expires:"), link.ExpiredAt.Format("2006-01-02 15:04"))
		}

		var copyToClipboard bool
		err = huh.NewConfirm().
			Title("Copy short URL to clipboard?").
			Affirmative("Yes").
			Negative("No").
			Value(&copyToClipboard).
			Run()
		if err != nil {
			return nil
		}

		if copyToClipboard {
			if err := clipboard.WriteAll(shortURL); err != nil {
				output.Error("Failed to copy to clipboard: %s", err)
			} else {
				output.Success("Copied to clipboard!")
			}
		}

		return nil
	},
}

func init() {
	shortenCmd.Flags().StringP("custom", "c", "", "Custom short code")
	shortenCmd.Flags().StringP("expiry", "e", "", "Expiration date (RFC3339 or YYYY-MM-DD)")
}
