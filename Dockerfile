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
RUN mkdir -p /usr/src/ptpmcn-backend
WORKDIR /usr/src/ptpmcn-backend
COPY package.json /usr/src/ptpmcn-backend
RUN npm install
RUN npm install pm2 -g
COPY . /usr/src/ptpmcn-backend
EXPOSE  8080
CMD [ "node", "./app/api/app.js" ]