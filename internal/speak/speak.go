package speak

import "os/exec"

func SayMessage(message string) {
	cmd := exec.Command("say", message)
	cmd.Run()
}