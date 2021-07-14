#!/bin/bash

GREEN='\033[1;32m'
NC='\033[0m'

echo -e "Starting crond.."
(crond)

echo -e "${GREEN}DB backup services started.${NC}"

tail -f /dev/null