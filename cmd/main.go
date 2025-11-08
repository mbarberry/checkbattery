package main

import (
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

func main() {
	cmd := exec.Command("pmset", "-g", "batt")
	var out strings.Builder
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		fmt.Printf("Error running command: %v", err)
		os.Exit(1)
	}
	battLevel := out.String()
	fmt.Printf("Pmset output is: %v\n", battLevel)
	idx := strings.Index(battLevel, "\t")
	if idx != -1 {
		after := battLevel[idx+1:]
		fmt.Printf("%v\n", after)
		percent, err := strconv.Atoi(after[:2])
		if err != nil {
			fmt.Printf("Error extracting percent: %v", err)
			os.Exit(1)
		}
		fmt.Printf("%v\n", percent)
	}
}
