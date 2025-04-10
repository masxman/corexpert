#!/bin/bash

# Define the output text file name
OUTPUT_FILE="combined_code_for_print.txt"

# Clear the output file or create it empty
echo "Creating/Clearing output file: $OUTPUT_FILE"
> "$OUTPUT_FILE"

# --- Files and Directories to Include ---
# Directories where we want to find relevant files
SEARCH_DIRS=("actions" "app" "components")

# --- Exclusion ---
# Path to exclude relative to the search start points
EXCLUDE_PATH="components/ui"

echo "Starting file processing..."
echo "Searching within: ${SEARCH_DIRS[*]}"
echo "Excluding path: $EXCLUDE_PATH"

# Use find to locate relevant files and process them
# -path '$EXCLUDE_PATH' -prune : If the path matches the exclude path, don't descend into it.
# -o : OR condition, allows processing other paths after pruning.
# -type f : Select only regular files.
# \( ... \) : Group file name conditions.
# -print0 : Print filename followed by null character (handles special chars safely).
# while read... : Read null-separated filenames safely.
find "${SEARCH_DIRS[@]}" -path "$EXCLUDE_PATH" -prune -o -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) -print0 | while IFS= read -r -d $'\0' file; do
  echo "  Adding: $file"
  # Add a header indicating the file name
  echo "" >> "$OUTPUT_FILE" # Extra newline before header
  echo "--- FILE: $file ---" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE" # Newline after header
  # Append the file content
  cat "$file" >> "$OUTPUT_FILE"
  # Add a footer and spacing for readability
  # Ensure a newline exists at the end, in case the original file didn't have one
  echo "" >> "$OUTPUT_FILE"
  echo "--- END FILE: $file ---" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE" # Add blank lines between files
  echo "" >> "$OUTPUT_FILE"
done

echo "File processing complete."
echo "Combined source code written to: $OUTPUT_FILE"
echo ""
echo "Next step: Convert '$OUTPUT_FILE' to PDF using your preferred method (e.g., text editor print-to-pdf, pandoc)."
