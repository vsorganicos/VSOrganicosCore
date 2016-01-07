#!/bin/bash

echo 'Stopping...'
docker stop $(docker ps -aq)

echo 'Removing...'
docker rm $(docker ps -aq)