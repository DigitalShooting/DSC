#!/bin/bash

MY_PATH="`dirname \"$0\"`"

mkdir -p $MY_PATH/API/bin/
g++ -o $MY_PATH/API/bin/Band $MY_PATH/API/Band.cc
g++ -o $MY_PATH/API/bin/NOP $MY_PATH/API/NOP.cc
g++ -o $MY_PATH/API/bin/Set $MY_PATH/API/Set.cc
g++ -o $MY_PATH/API/bin/ReadSettings $MY_PATH/API/ReadSettings.cc
