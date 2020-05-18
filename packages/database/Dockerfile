FROM postgres:11

COPY ./src/create_db.sh /docker-entrypoint-initdb.d/20-create_db.sh

COPY ./src/schema.sql /schema.sql

COPY ./src/data.sql /data.sql

RUN chmod +x /docker-entrypoint-initdb.d/20-create_db.sh
