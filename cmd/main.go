package main

import (
	"log"

	"checkbattery/internal/battery"
	"checkbattery/internal/speak"
)

func main() {
	b, err := battery.NewCheck()
	if err != nil {
		log.Fatalf("error initializing program: %v\n", err)
	}
	err := b.ParseLevel()
	if err != nil {
		log.Fatalf("error parsing charge level: %v\n", err)
	}
	if b.IsCharging() && b.Level > 80 {
		speak.SayMessage("Take off charger.")
	}
	if !b.IsCharging() && b.Level < 20 {
		speak.SayMessage("Put on charger.")
	}
}
