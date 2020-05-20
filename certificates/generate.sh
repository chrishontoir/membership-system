#!/bin/bash
cd $(dirname "$0")

echo generate certificates
openssl req -x509 -newkey rsa:4096 -keyout memstem-key.pem -out memstem-cert.pem -days 365 -nodes -subj '/CN=localhost'
