#!/bin/bash
#aws ecr get-login --region us-east-1

docker build -m 256M -t vsorganicos/coreapi:latest .

echo 'Tagging image...'
docker tag vsorganicos/coreapi:latest 698115382733.dkr.ecr.us-east-1.amazonaws.com/vsorganicos/coreapi:latest

echo 'Commit image...'
#docker commit -m "Commit success" 698115382733.dkr.ecr.us-east-1.amazonaws.com/vsorganicos/coreapi:latest