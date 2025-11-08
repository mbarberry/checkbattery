#!/bin/bash

DIR="/Users/mbarberry/checkbattery"

cd "$DIR" || exit 1

/Users/mbarberry/.gvm/gos/go1.24/bin/go run $DIR/cmd/main.go >> $DIR/log/jobs.log 2>&1