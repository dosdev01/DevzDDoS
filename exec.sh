#!/bin/bash

while true
do
  pm2 stop m-script || true
  pm2 delete m-script || true
  clear
  pm2 start -n m-script python m.py -f
  sleep 29m
done
