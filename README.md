# PTPMCN 

## Build 
```
 sudo docker build -t wtt-posts:{ version } .
```
 ## Run 
```
 sudo docker run --rm -p {port}:8080 --env NODE_ENV={ env } wtt-posts:{version} (dev: 8082, main: 8182)
 ```
 ## Create tag
 ```
 sudo docker tag wtt-posts:{ version } tuannq(repo)/wtt(group)/wtt-posts:{ version }
 ```
 ## Push tag
 ```
 sudo docker push tuannq(repo)/wtt(group)/wtt-posts:{ version }
 ```
 ## Pull tag
 ```
 sudo docker pull tuannq(repo)/wtt(group)/wtt-posts:{ version }
 ```
 ## View image 
 ```
 sudo docker image ls
 ```
 ## View container
 ```
 sudo docker container ls
 ```
 ## Stop
 ```
 sudo docker stop {container_id}
 ```
 ## Remove image
 ```
  sudo docker rmi {image_id}
 ```