#!/bin/bash

GREEN='\033[1;32m'
NC='\033[0m'

echo -e "Starting Postfix.."
(postfix start)
echo -e "Starting Opendkim.."
(opendkim)

echo -e "${GREEN}Mail services started.${NC}"

tail -f /dev/null