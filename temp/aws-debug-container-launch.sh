#!/bin/bash
echo "===== DEBUG START =====" > /tmp/debug.log 2>&1
echo "Date: $(date)" >> /tmp/debug.log 2>&1
echo "Hostname: $(hostname)" >> /tmp/debug.log 2>&1
echo "Environment variables:" >> /tmp/debug.log 2>&1
env | sort >> /tmp/debug.log 2>&1

echo "===== DNS RESOLUTION =====" >> /tmp/debug.log 2>&1
echo "Resolving kms.ap-south-1.amazonaws.com:" >> /tmp/debug.log 2>&1
nslookup kms.ap-south-1.amazonaws.com >> /tmp/debug.log 2>&1 || echo "nslookup failed" >> /tmp/debug.log 2>&1

echo "===== NETWORK CONNECTIVITY =====" >> /tmp/debug.log 2>&1
echo "Trying to connect to KMS endpoint:" >> /tmp/debug.log 2>&1
curl -v https://kms.ap-south-1.amazonaws.com >> /tmp/debug.log 2>&1 || echo "curl failed" >> /tmp/debug.log 2>&1

echo
