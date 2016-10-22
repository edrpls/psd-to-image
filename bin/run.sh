#!/bin/bash

if [[ "$NODE_ENV" = "test" || "$NODE_ENV" = "production" ]] ; then
    npm run defServer
else
    npm run devServer & npm run webpackDev
fi

