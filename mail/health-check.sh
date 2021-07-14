#!/bin/bash

if postfix status; then
  echo "OK"
  exit 0
else
  echo "ERROR"
  exit 1
fi