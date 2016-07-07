# Nginx blacklist ip use lua + redis

1. Nginx + lua + redis

- a quick LUA access script for nginx to check IP addresses against an
`ip_blacklist` set in Redis, and if a match is found send a HTTP 403

2. Dashboard + API for manage blacklist

- A restful api + dashboard write in python for add/del/list ip blacklist


## Work with api

- add user

```
http POST http://127.0.0.1:5000/api/users username=test1 password=test1
```

- get token

```
http GET http://127.0.0.1:5000/api/token -a test1:test1
```


- add ip to blacklist

```
http POST http://127.0.0.1:5000/api/add ip=192.168.1.1 -a eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ2Nzg2OTkwNSwiaWF0IjoxNDY3ODY5MzA1fQ.eyJpZCI6M30.OYN3DbvtmOjRJvc9lgfNyTkEVNSfGO3i08M3JRF6KL0:token
```

## Demo

- frontend : http://ft.vietoss.com


- admin : http://ft.vietoss.com:6699

user : test

pass : test


