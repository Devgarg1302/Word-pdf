#!/bin/bash

# Pull images
docker pull devgarg1302/backend-app:latest
docker pull devgarg1302/frontend-app:latest

# Run containers
docker run -d -p 3000:3000 devgarg1302/backend-app:latest
docker run -d -p 5173:5173 devgarg1302/frontend-app:latest
