FROM alpine:3.13.4
# FROM ubuntu:20.04

RUN apk add --no-cache bash
RUN apk add --no-cache postfix
RUN apk add --no-cache mailx
RUN apk add --no-cache opendkim
RUN apk add --no-cache opendkim-utils

COPY postfix/main.cf /etc/postfix/main.cf
COPY postfix/smtp_header_checks /etc/postfix/smtp_header_checks
COPY start.sh /etc/mail/start.sh

RUN mkdir /etc/opendkim/keys
RUN mkdir /etc/opendkim/keys/l2hestia.com
RUN mkdir /var/spool/postfix/opendkim
COPY opendkim/opendkim.conf /etc/opendkim/opendkim.conf
COPY opendkim/signing.table /etc/opendkim/signing.table
COPY opendkim/key.table /etc/opendkim/key.table
COPY opendkim/trusted.hosts /etc/opendkim/trusted.hosts
COPY opendkim/keys/default.txt /etc/opendkim/keys/l2hestia.com/default.txt
COPY opendkim/keys/default.private /etc/opendkim/keys/l2hestia.com/default.private

RUN chown -R opendkim:opendkim /etc/opendkim
RUN chmod -R go-rwx /etc/opendkim/keys
RUN chown -R opendkim:postfix /var/spool/postfix/opendkim
RUN chmod g+s /var/spool/postfix/opendkim/

EXPOSE 25

# Add Healthcheck
COPY health-check.sh /usr/local/bin/health-check.sh
RUN chmod 755 /usr/local/bin/health-check.sh
HEALTHCHECK --interval=1m --timeout=5s \
    CMD sh /usr/local/bin/health-check.sh

CMD ["sh", "/etc/mail/start.sh"]
