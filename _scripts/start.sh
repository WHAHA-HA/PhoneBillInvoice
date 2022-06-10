#!/bin/bash

NODE_ENV=$1 pm2 start /opt/lcma-ui/$1/dist/server/app.js --name="ui-$1"

