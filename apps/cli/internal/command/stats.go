package command

import (
	"fmt"

	"github.com/andriawan24/pendek-in-cli/internal/client"
	"github.com/andriawan24/pendek-in-cli/internal/config"
	"github.com/andriawan24/pendek-in-cli/internal/output"
	"github.com/spf13/cobra"
)

var statsCmd = &cobra.Command{
	Use:   "stats",
	Short: "Show analytics and statistics",
	RunE: func(cmd *cobra.Command, args []string) error {
		timeRange, _ := cmd.Flags().GetString("range")

		c := client.New()
		analytics, err := c.GetAnalytics(timeRange)
		if err != nil {
			output.Error("%s", err)
			return nil
		}

		if config.JSONOutput() {
			return output.PrintJSON(analytics)
		}

		fmt.Printf("  %s  %s to %s\n\n",
			output.Bold("Analytics"),
			analytics.FromDate.Format("2006-01-02"),
			analytics.ToDate.Format("2006-01-02"),
		)

		output.PrintTable(
			[]string{"Metric", "Value"},
			[][]string{
				{"Total Clicks", output.FormatNumber(analytics.TotalClicks)},
				{"Active Links", output.FormatNumber(analytics.TotalActiveLinks)},
				{"Avg Daily Clicks", output.FormatNumber(analytics.AvgDailyClick)},
			},
		)

		if analytics.TopLink != nil {
			fmt.Printf("\n  %s  %s (%s clicks)\n",
				output.Faint("Top Link:"),
				analytics.TopLink.Link.ShortCode,
				output.FormatNumber(analytics.TopLink.TotalClicks),
			)
		}

		if len(analytics.DeviceBreakdowns) > 0 {
			fmt.Printf("\n  %s\n", output.Bold("Devices"))
			deviceRows := make([][]string, 0, len(analytics.DeviceBreakdowns))
			for _, d := range analytics.DeviceBreakdowns {
				deviceRows = append(deviceRows, []string{d.Type, output.FormatNumber(d.Value)})
			}
			output.PrintTable([]string{"Device", "Clicks"}, deviceRows)
		}

		if len(analytics.TopCountries) > 0 {
			fmt.Printf("\n  %s\n", output.Bold("Top Countries"))
			countryRows := make([][]string, 0, len(analytics.TopCountries))
			for _, c := range analytics.TopCountries {
				countryRows = append(countryRows, []string{c.Type, output.FormatNumber(c.Value)})
			}
			output.PrintTable([]string{"Country", "Clicks"}, countryRows)
		}

		return nil
	},
}

func init() {
	statsCmd.Flags().StringP("range", "r", "7d", "Time range (7d, 30d, 90d)")
}
