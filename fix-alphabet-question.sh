#!/bin/bash

# This script fixes the DG is to WT alphabet series question
# by finding SO in the options array and updating correctAnswer to that index

cd /Users/jameshe/Desktop/11plus-study

# Run the fix script
npx tsx prisma/fix-dg-wt-question.mts
