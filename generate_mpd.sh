#!/bin/bash

# Usage: ./generate_mpd.sh input.mp4 8785

INPUT_MP4=$1
MOVIE_ID=$2

if [ -z "$INPUT_MP4" ] || [ -z "$MOVIE_ID" ]; then
  echo "Usage: $0 input.mp4 MOVIE_ID"
  exit 1
fi

# Prepare temp working directory
TMP_DIR=$(mktemp -d)
mkdir -p public/streams/$MOVIE_ID

# Step 1: Split video and audio
ffmpeg -y -i "$INPUT_MP4" -c:v copy -an "$TMP_DIR/video.mp4"
ffmpeg -y -i "$INPUT_MP4" -c:a copy -vn "$TMP_DIR/audio.mp4"

# Step 2: Package to DASH
packager \
  input="$TMP_DIR/video.mp4",stream=video,output="public/streams/$MOVIE_ID/video.mp4" \
  input="$TMP_DIR/audio.mp4",stream=audio,output="public/streams/$MOVIE_ID/audio.mp4" \
  --mpd_output "public/streams/$MOVIE_ID/$MOVIE_ID.mpd"

# Done
echo "✅ DASH files created in public/streams/$MOVIE_ID/"
rm -rf "$TMP_DIR"
