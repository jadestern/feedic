#!/bin/bash

# PWA Icon Optimization Script
# Converts black backgrounds to transparent and scales icons to 75% size

set -e

PUBLIC_DIR="public"
SCALE_PERCENT=75

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Priority list - process these first
PRIORITY_FILES=(
    "android-chrome-512x512.png"
    "android-chrome-192x192.png"
    "apple-touch-icon.png"
    "icon-384x384.png"
    "icon-256x256.png"
    "icon-144x144.png"
    "icon-96x96.png"
    "icon-72x72.png"
    "icon-48x48.png"
    "favicon-32x32.png"
    "favicon-16x16.png"
)

process_icon() {
    local file="$1"
    local filepath="${PUBLIC_DIR}/${file}"
    
    if [[ ! -f "$filepath" ]]; then
        echo -e "${RED}File not found: $filepath${NC}"
        return 1
    fi
    
    # Get original file size and dimensions
    original_size=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath")
    dimensions=$(identify -format "%wx%h" "$filepath")
    width=$(echo $dimensions | cut -d'x' -f1)
    height=$(echo $dimensions | cut -d'x' -f2)
    
    echo -e "${BLUE}Processing: $file (${dimensions}, ${original_size} bytes)${NC}"
    
    # Create temporary file
    temp_file="${filepath}.tmp"
    
    # Process with ImageMagick (using magick instead of convert to avoid deprecation warning)
    magick "$filepath" -alpha off -transparent black \
        \( +clone -resize ${SCALE_PERCENT}% -gravity center -extent ${width}x${height} \) \
        -compose over -composite png32:"$temp_file"
    
    if [[ ! -f "$temp_file" ]]; then
        echo -e "${RED}Failed to create temporary file for $file${NC}"
        return 1
    fi
    
    # Compress with pngquant
    pngquant --force --quality=70-95 --strip --output "$filepath" "$temp_file"
    
    # Clean up temporary file
    rm -f "$temp_file"
    
    # Get new file size
    new_size=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath")
    reduction_percent=$(echo "scale=1; ($original_size - $new_size) * 100 / $original_size" | bc)
    
    echo -e "${GREEN}✓ Complete: $file → ${new_size} bytes (${reduction_percent}% reduction)${NC}"
    echo
}

echo -e "${YELLOW}PWA Icon Optimization Script${NC}"
echo -e "Transparent background + ${SCALE_PERCENT}% scaling + compression"
echo "=============================================="
echo

# Check if required tools are available
if ! command -v magick &> /dev/null; then
    echo -e "${RED}Error: ImageMagick 'magick' command not found. Install with: brew install imagemagick${NC}"
    exit 1
fi

if ! command -v pngquant &> /dev/null; then
    echo -e "${RED}Error: pngquant not found. Install with: brew install pngquant${NC}"
    exit 1
fi

if ! command -v bc &> /dev/null; then
    echo -e "${RED}Error: bc not found. Install with: brew install bc${NC}"
    exit 1
fi

# Process priority files first
echo -e "${YELLOW}Processing priority files...${NC}"
for file in "${PRIORITY_FILES[@]}"; do
    process_icon "$file"
done

echo -e "${GREEN}All icons processed successfully!${NC}"
echo
echo -e "${BLUE}Summary:${NC}"
echo "- Black backgrounds converted to transparent"
echo "- Icon content scaled to ${SCALE_PERCENT}% with centered padding"
echo "- Files compressed with pngquant"
echo "- All PWA manifest paths remain unchanged"