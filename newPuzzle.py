#!/usr/bin/env python3
import random
from random import choices
import socket
import urllib.request
import os.path
import os

# We remember in a file which id has been published
last_id_lines = []
with open('current_published.txt') as f:
    last_id_lines = f.read().splitlines()

next_publish = int(last_id_lines[0]) + 1
print(next_publish)

# Get the content of the next puzlles
with open('nextPuzzles/' + str(next_publish) + '.tsx', 'r') as file:
    fileContent = file.read()

with open("components/puzzle.tsx", "w") as f:
    f.write(fileContent)

with open('current_published.txt', 'w') as f:
    f.write(f"{next_publish}\n")


## This is a safety check. We check if there are enough puzlles
# In that case we ping Healthcheck. Otherwise we don't do anything
# In which case we will get a message from Healthceck and I have enough days to react
enough_puzzles = True
for r in range(next_publish, next_publish+5):
    if os.path.exists(f'nextPuzzles/{r}.txt') == False:
        enough_puzzles = False

if enough_puzzles == True:
    # Ensure the script worked
    try:
        url = os.envrion("HEALTHCHECK_URL")
        urllib.request.urlopen(url, timeout=10)
    except socket.error as e:
        # Log ping failure here...
        print("Ping failed: %s" % e)
