#!/bin/bash

if pgrep crond; then
  echo "OK"
  exit 0
else
  echo "ERROR"
  exit 1
fi