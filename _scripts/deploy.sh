#!/bin/bash

SCRIPT_PATH=`pwd`

cd ..

$SCRIPT_PATH/stop.sh $1
sudo rm $1
sudo ln -s v$2 $1
$SCRIPT_PATH/start.sh $1 

