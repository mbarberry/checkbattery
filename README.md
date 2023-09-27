# Suggested Usage

As a crontab that runs every minute. Use `crontab -e` to open cron. Modify configuration to use your variables. Default output is a log/jobs.log file that will capture standard output and standard error.

```console
SHELL=/bin/bash
*/1 * * * * DIR="<path-to-install-folder>"; <path-to-node-executable> $DIR/index.js "<Your-time-to-charge-message>" "Your-take-off-charger-message" >> $DIR/log/jobs.log 2>&1
```

# Database

**Initialize your database before first usage with `node db/init.js`**
