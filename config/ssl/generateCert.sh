#!/bin/bash

openssl genrsa -des3 -out server.key 4096
openssl req -new -key server.key -out server.csr
cp server.key server.key.org
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
