FROM node:20-bullseye

# install python dan ffmpeg (dibutuhkan yt-dlp dan music bot)
RUN apt-get update && apt-get install -y \
    python3 \
    python-is-python3 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy package.json dulu (biar cache optimal)
COPY package*.json ./

RUN npm ci

# copy semua file project
COPY . .

# start bot
CMD ["npm", "start"]
