package utils

import (
	"fmt"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func SendEmail(to string, link string) {
	m := gomail.NewMessage()
	m.SetHeader("From", os.Getenv("SMTP_FROM_EMAIL"))
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Verify your email")
	m.SetBody("text/html", fmt.Sprintf("Click <a href='%s'>here</a> to verify.", link))

	smtpServer := os.Getenv("SMTP_SERVICE")
	smtpPort, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		fmt.Println("Error sending email", err)
		return
	}
	smtpUsername := os.Getenv("SMTP_USERNAME")
	smtpPassword := os.Getenv("SMTP_PASSWORD")

	fmt.Println(smtpPassword)
	d := gomail.NewDialer(smtpServer, smtpPort, smtpUsername, smtpPassword)

	if err := d.DialAndSend(m); err != nil {
		fmt.Println("Error sending email", err)
	}
}