#!/bin/bash

find . -type f -name "*.aif" | while read aiff_file; do
  aiff_file=$(echo "$aiff_file" | sed 's/^.\///; s/^\///')
  mp3_file=$(echo "$aiff_file" | sed 's/__/_/g; s/.aif$/.mp3/')
  echo "ffmpeg -y -hide_banner -loglevel error -i \"$aiff_file\" -ab 128k -ac 2 \"$mp3_file\""
  # echo ""
  ffmpeg -y -hide_banner -loglevel error -i "$aiff_file" -ab 128k -ac 2 "$mp3_file"
done