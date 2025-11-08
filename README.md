## Idea

Batteries last longer when they are kept charged between 20 and 80 percent. This program works on MacOS and will speak alert messages when your (1) not charging and your battery level is at or below 20, (2) are charging and your battery level is at or above 80.

## Suggested Usage

As a crontab that runs every minute. Use `crontab -e` to open cron. Modify the example below to use your variables. Default output is ./log/jobs.log that will capture standard output and standard error.

Update the crontab to look like:

```console
SHELL=/bin/bash
*/1 * * * * DIR="<abs-path-to-program-root-on-your-system>"; $DIR/scripts/run_checkbattery.sh >> $DIR/log/jobs.log 2>&1
```

Additionally, update the DIR variable and absolute path to Go in `scripts/run_checkbattery.sh`
