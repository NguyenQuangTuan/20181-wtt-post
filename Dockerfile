# # Use an official Python runtime as a parent image
# FROM node:9.11.1-alpine

# # Set the working directory to /app
# WORKDIR /home/tuan/Documents/TestDocker

# # Copy the current directory contents into the container at /app
# ADD . /app

# # Install any needed packages specified in requirements.txt
# RUN pip install --trusted-host pypi.python.org -r requirements.txt

# # Make port 80 available to the world outside this container
# EXPOSE 80

# # Define environment variable
# ENV NAME World

# # Run app.py when the container launches
# CMD ["python", "app.py"]

FROM node:9.11.1-alpine
RUN mkdir -p /usr/src/wtt-post
WORKDIR /usr/src/wtt-post
COPY package.json /usr/src/wtt-post
RUN npm install
COPY . /usr/src/wtt-post
RUN npm install pm2 -g
EXPOSE  8080
CMD ["pm2-runtime", "./launcher/server.yml"]