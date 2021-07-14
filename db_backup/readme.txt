link to video (little useful): https://www.youtube.com/watch?v=kbCytSYPh0E
mount HDD: https://www.raspberrypi.org/documentation/configuration/external-storage.md

1)mount wanted backup location (HDD) + setup auto mount on startup

2)set ENV
- PGPASSWORD=${DB_PASSWORD}
- PGUSER=${DB_USER}
- PGDATABASE=servicedb
- PGHOST=${LOCAL_IP}

3)set VOLUME
volumes:
    - ${BACKUP_VOLUME}:/etc/backups/dumps

4)run container
