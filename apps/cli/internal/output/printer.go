package output

import (
	"fmt"
	"os"

	"github.com/fatih/color"
	"github.com/mattn/go-isatty"
)

var (
	successPrefix = color.New(color.FgGreen, color.Bold).SprintFunc()
	errorPrefix   = color.New(color.FgRed, color.Bold).SprintFunc()
	warnPrefix    = color.New(color.FgYellow, color.Bold).SprintFunc()
	infoStyle     = color.New(color.FgCyan).SprintFunc()
	boldStyle     = color.New(color.Bold).SprintFunc()
	faintStyle    = color.New(color.Faint).SprintFunc()
)

func init() {
	if os.Getenv("NO_COLOR") != "" || !isatty.IsTerminal(os.Stdout.Fd()) {
		color.NoColor = true
	}
}

func Success(msg string, args ...any) {
	fmt.Fprintf(os.Stderr, "%s %s\n", successPrefix("✓"), fmt.Sprintf(msg, args...))
}

func Error(msg string, args ...any) {
	fmt.Fprintf(os.Stderr, "%s %s\n", errorPrefix("Error:"), fmt.Sprintf(msg, args...))
}

func Warn(msg string, args ...any) {
	fmt.Fprintf(os.Stderr, "%s %s\n", warnPrefix("Warning:"), fmt.Sprintf(msg, args...))
}

func Info(text string) string {
	return infoStyle(text)
}

func Bold(text string) string {
	return boldStyle(text)
}

func Faint(text string) string {
	return faintStyle(text)
}
