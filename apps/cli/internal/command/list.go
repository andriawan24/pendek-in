package command

import (
	"fmt"

	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:     "list",
	Aliases: []string{"ls"},
	Short:   "List all your shortened URLs",
	RunE: func(cmd *cobra.Command, args []string) error {
		c := client.New()
		links, err := c.ListLinks()
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		if len(links) == 0 {
			output.Warn("No links found. Create one with 'pendek shorten <url>'")
			return nil
		}

		if config.JSONOutput() {
			return output.PrintJSON(links)
		}

		rows := make([][]string, 0, len(links))
		for _, link := range links {
			shortURL := fmt.Sprintf("%s/%s", config.APPURL(), link.ShortCode)
			rows = append(rows, []string{
				link.ShortCode,
				output.Truncate(link.OriginalURL, 50),
				shortURL,
				output.FormatNumber(link.ClickCount),
				link.CreatedAt.Format("2006-01-02"),
			})
		}

		fmt.Printf("  %s links found\n\n", output.Bold(fmt.Sprintf("%d", len(links))))
		output.PrintTable(
			[]string{"Code", "Original URL", "Short URL", "Clicks", "Created"},
			rows,
		)
		return nil
	},
}
