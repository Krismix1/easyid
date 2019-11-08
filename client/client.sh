#!/usr/bin/env bash

token=$(curl -s localhost:42069/auth | jq -r .token)
curl -H "Authorization: $token" localhost:5000/users
