#!/bin/bash
find . -type f \
    -not -path "./.git/*" \
    -not -path "./node_modules/*" \
    -not -path "./enchant.js/node_modules/*" \
    -print0 | xargs -0 dos2unix