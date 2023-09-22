# Suggested Usage

As a crontab that runs every minute.

Replace with your variables.

This will output to a file called jobs.log in the main folder.

```console
SHELL=/bin/bash
*/1 * * * * DIR="<path to folder>"; <path to node executable> $DIR/chargeScript.js "<Your time-to-charge message>" "Your take-off-charger message" >> $DIR/jobs.log 2>&1
```

**Initialize your database before first usage with `node db/init.js`**
