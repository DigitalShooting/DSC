#!/bin/bash

SSLNAME="DSC_SSL"
SSLDAYS="36500"

# Generate new key and crt
openssl req -x509 -nodes -newkey rsa:2048 -keyout $SSLNAME.key -out $SSLNAME.crt -days $SSLDAYS -batch

# Copy to trusted
sudo cp $SSLNAME.crt /usr/local/share/ca-certificates/$SSLNAME.crt
sudo update-ca-certificates
