#!/bin/bash

# Remove existing .git directory if it exists
if [ -d ".git" ]; then
  echo "Removing existing Git repository..."
  rm -rf .git
fi

# Initialize a new Git repository
echo "Initializing new Git repository..."
git init

# Add all files to the staging area
echo "Adding files to Git..."
git add .

# Create an initial commit
echo "Creating initial commit..."
git commit -m "Initial commit"

# Instructions for connecting to GitHub
echo ""
echo "Repository initialized! To connect to GitHub:"
echo "1. Create a new repository on GitHub (don't initialize with README, license, or .gitignore)"
echo "2. Run the following commands:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git push -u origin main"
echo ""
echo "Done!" 