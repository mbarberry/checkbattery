package battery_test

import (
	"checkbattery/internal/battery"
	"testing"
)

func TestBattery_ParseLevel(t *testing.T) {
	tests := []struct {
		name          string
		details       string
		expectedLevel int
		wantErr       bool
	}{
		{
			name:          "battery charging",
			details:       "Now drawing from 'Battery Power'\n -InternalBattery-0 (id=8126563)\t55%; discharging; 3:03 remaining present: true",
			expectedLevel: 55,
			wantErr:       false,
		},
		{
			name:          "empty details string",
			details:       "",
			expectedLevel: 55,
			wantErr:       true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b := battery.Battery{
				Details: tt.details,
			}
			gotErr := b.ParseLevel()
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("ParseLevel() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("ParseLevel() succeeded unexpectedly")
			}
			if b.Level != tt.expectedLevel {
				t.Errorf("expected %v and got %v", tt.expectedLevel, b.Level)
			}
		})
	}
}
