#!/bin/bash
pm2 stop ui-$1
pm2 delete ui-$1
