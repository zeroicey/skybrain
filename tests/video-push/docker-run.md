sudo docker run -d \
  --name mediamtx \
  --restart always \
  -e MTX_RTSPTRANSPORTS=tcp \
  -p 8554:8554 \
  -p 8888:8888 \
  bluenviron/mediamtx:latest
