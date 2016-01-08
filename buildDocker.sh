#!/bin/bash
#aws ecr get-login --region us-east-1

docker build -m 256M -t core/coreapi:latest .

echo 'Tagging image...'
docker tag core/coreapi:latest 698115382733.dkr.ecr.us-east-1.amazonaws.com/core:latest

echo 'Commit image...'
#docker commit -m "Commit success" 698115382733.dkr.ecr.us-east-1.amazonaws.com/vsorganicos/coreapi:latest
