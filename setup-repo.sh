#!/bin/bash

# Set these variables
GITHUB_USERNAME="your-github-username"
REPO_NAME="split-ease"

echo "Setting up GitHub repository for SplitEase..."

# Make sure the .github directory exists
mkdir -p .github/workflows

# Setup main branch with just the README and basic files
echo "Setting up main branch..."
git init
git add README.md .gitignore .github
git commit -m "Initial commit: Project documentation and CI/CD setup"
git branch -M main

# Add the remote origin (uncomment and run after creating the repository on GitHub)
echo "Please create a repository on GitHub named '$REPO_NAME' and then uncomment and run the following commands:"
echo "git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "git push -u origin main"

# Instructions for dev branch
echo ""
echo "After pushing to main, run these commands to set up the dev branch with all code:"
echo "git checkout -b dev"
echo "git add ."
echo "git commit -m \"Add SplitEase frontend implementation\""
echo "git push -u origin dev"

echo ""
echo "Script completed. Follow the instructions above to finish the repository setup." 