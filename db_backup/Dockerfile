FROM alpine:3.13.4

RUN apk add --no-cache bash
RUN apk add --no-cache postgresql

RUN mkdir /etc/backups
RUN mkdir /etc/backups/dumps
COPY start.sh /etc/backups/start.sh
COPY crontab.txt /etc/backups/crontab.txt
RUN crontab /etc/backups/crontab.txt

COPY health-check.sh /usr/local/bin/health-check.sh
RUN chmod 755 /usr/local/bin/health-check.sh
HEALTHCHECK --interval=10m --timeout=5s \
    CMD sh /usr/local/bin/health-check.sh

CMD ["sh", "/etc/backups/start.sh"]
