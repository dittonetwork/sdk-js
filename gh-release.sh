#!/bin/bash

# Load the environment variables from the .env file
source .env

# Now use the environment variables in your script
npx nx release --skip-publish
