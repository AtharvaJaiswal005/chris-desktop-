#!/bin/bash

# ChrisGPT Mac Install Helper
# Run this once after dragging ChrisGPT to Applications

echo "Installing ChrisGPT..."

# Remove quarantine attribute
xattr -cr /Applications/ChrisGPT.app 2>/dev/null

if [ -d "/Applications/ChrisGPT.app" ]; then
    echo "Done! Opening ChrisGPT..."
    open /Applications/ChrisGPT.app
    echo ""
    echo "ChrisGPT is now installed. You can delete this script."
else
    echo "Error: ChrisGPT.app not found in Applications folder."
    echo "Please drag ChrisGPT.app to your Applications folder first."
fi
