# Idea

Batteries last longer when they are kept charged between 20 and 80 percent. This program works on MacOS and will speak alert messages when your (1) not charging and your battery level is at or below 20, (2) are charging and your battery level is at or above 80. You can customize the messages. The first 5 alerts will occur every 30 seconds. All remaining alerts will occur every 10 minutes. (If you don't hear the first 5 it's likely you are away and you may annoy friends or neighbors if your computer keeps speaking.)

# Suggested Usage

As a crontab that runs every minute. Use `crontab -e` to open cron. Modify the example below to use your variables. Default output is ./log/jobs.log that will capture standard output and standard error.

Update the crontab to look like:

```console
SHELL=/bin/bash
*/1 * * * * DIR="<abs-path-to-clone-on-your-system>"; <abs-path-to-node-executable> $DIR/src/index.js <your-take-off-charger-message> <your-charge-message> >> $DIR/log/jobs.log 2>&1
```

# Database

**Initialize your database before first usage with `node db/init.js` from the project root directory.**
