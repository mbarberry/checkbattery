package battery

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

type Battery struct {
	Details string
	Level   int
}

func (b *Battery) ParseLevel() error {
	idx := strings.Index(b.Details, "\t")
	if idx < 0 {
		return fmt.Errorf("no tab in string: %v", b.Details)
	}
	level, err := strconv.Atoi(b.Details[idx+1 : idx+3])
	if err != nil {
		return fmt.Errorf("cannot convert percent to int: %v", err)
	}
	b.Level = level
	return nil
}

func (b *Battery) IsCharging() bool {
	return strings.Contains(b.Details, "AC")
}

func NewCheck() (*Battery, error) {
	cmd := exec.Command("pmset", "-g", "batt")
	var out strings.Builder
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return &Battery{}, fmt.Errorf("error running command: %v", err)
	}
	return &Battery{
		Details: out.String(),
	}, nil
}
