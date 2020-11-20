# posts_backend

URL:
1) https://innotechfullstack.ml/api/login

A) POST 
data = {

      "username": "khaled",
      "password": "password"
}

JSON Data Returned: 
      { 
          "Id": 1,
          "token": "n4bbvn9821an4sc452pmch"
      }
      
B) DELETE
data = {

      "token": "n4bbvn9821an4sc452pmch"
}

no JSON Data Returned


2) https://innotechfullstack.ml/api/posts

A) GET 

no Params needed
JSON Data Returned: 
    [
      { 
          "Id": 1,
          "user_id": 1,
          "username": "TheLorax",
          "content": "Stop cutting down my trees!",
      },
      { 
          "Id": 2,
          "user_id": 2,
          "username": "khaled",
          "content": "Don't stop cutting down my trees!",
      },
    ]
      
   B) POST
   data = {
      "content" : "first post"
      "token": "n4bbvn9821an4sc452pmch"
}
 JSON Data Returned: 
 {
  "id":1,
  "userId: 3"
  "username": "khaled",
  "content": "first post",
 }

C) PATCH 
data = {
      "postId" : 1
      "content" : "updated first post"
      "token": "n4bbvn9821an4sc452pmch"
}
 JSON Data Returned: 
 {
  "id":1,
  "userId: 3"
  "username": "khaled",
  "content": "updated first post",
 }
 
 D) DELETE 
data = {
      "postId" : 1
      "token": "n4bbvn9821an4sc452pmch"
}
 no JSON Data Returned: 

3) https://innotechfullstack.ml/api/users 
POST , DELETE 
