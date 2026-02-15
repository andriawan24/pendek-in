package output

import (
	"fmt"
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
)

var (
	headerStyle = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("12"))
	cellStyle   = lipgloss.NewStyle().Padding(0, 1)
	borderStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("240"))
)

func PrintTable(headers []string, rows [][]string) {
	if len(rows) == 0 {
		return
	}

	t := table.New().
		Border(lipgloss.NormalBorder()).
		BorderStyle(borderStyle).
		Headers(headers...).
		StyleFunc(func(row, col int) lipgloss.Style {
			if row == table.HeaderRow {
				return headerStyle
			}
			return cellStyle
		})

	for _, row := range rows {
		t.Row(row...)
	}

	fmt.Fprintln(os.Stdout, t.Render())
}

func Truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-3] + "..."
}

func FormatNumber(n int64) string {
	if n < 1000 {
		return fmt.Sprintf("%d", n)
	}
	if n < 1_000_000 {
		return fmt.Sprintf("%.1fK", float64(n)/1000)
	}
	return fmt.Sprintf("%.1fM", float64(n)/1_000_000)
}

func FormatBreakdown(items []struct{ Type string; Value int64 }) string {
	if len(items) == 0 {
		return "N/A"
	}
	parts := make([]string, 0, len(items))
	for _, item := range items {
		parts = append(parts, fmt.Sprintf("%s: %s", item.Type, FormatNumber(item.Value)))
	}
	return strings.Join(parts, " | ")
}
