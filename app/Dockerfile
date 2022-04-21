FROM node:alpine

# Arguments
ARG NODE_ENV

# Set the working directory
WORKDIR  /app

# Copy the files
COPY package*.json ./
COPY . .

# Install the packages
RUN if [ $NODE_ENV=DEV ] ; then npm install --ony=dev; else npm install --only=prod ; fi

# Expose the port
ENV PORT=3000
EXPOSE ${PORT}

# Run the app
CMD if [ "$NODE_ENV"="DEV" ] ; then npm run dev; else npm run start ; fi
