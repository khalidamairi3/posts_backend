require('dotenv').config()
const express = require("express");
const mariadb=require("mariadb")
const bodyParser= require("body-parser");
const app = express();
app.use(bodyParser())
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


const pool = mariadb.createPool({
    host: process.env.HOST,
    port:process.env.PORT,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE

});

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var generate_token = function() {
    return rand() + rand(); // to make it longer
}


app.post('/api/login',async(req,res)=>{
    

    try{
        username = req.body.username;
        password = req.body.password;
        conn=await pool.getConnection();
        user = await conn.query("SELECT * FROM users WHERE username = ?",[username]);
        if(user[0].password == password){
            loginToken = generate_token()
            await conn.query("INSERT INTO sessions (token,user_id) VALUES (?,?)",[loginToken,user[0].id])
            err = false
        }
        else{
            err = true
        }

    }catch(e){
        console.log(e);
        err = true
        
    }finally{
        if(conn) conn.end();
        if (!err) return res.json({ "id" : user[0].id, "token" : loginToken});
        res.sendStatus(500);
        
    }
    
})

app.delete('/api/login',async(req,res)=>{
    

    try{
        token = req.body.token;
        conn=await pool.getConnection();
        user = await conn.query("DELETE FROM sessions WHERE token = ?",[token]);
        err = false

    }catch(e){
        console.log(e);
        err = true
        
    }finally{
        if(conn) conn.end();
        if (!err) return res.sendStatus(204)
        res.sendStatus(500);
        
    }
    
})


app.get('/api/posts',async(req,res)=>{
    

    try{
        conn=await pool.getConnection();
        posts = await conn.query("SELECT p.id, p.user_id, u.username , p.content FROM posts p INNER JOIN users u ON p.user_id = u.id ");
        err = false

    }catch(e){
        console.log(e);
        err = true
        
    }finally{
        if(conn) conn.end();
        if (!err) return res.json(posts);
        res.sendStatus(500);
        
    }
    
})

app.post('/api/posts',async(req,res)=>{
    

    try{
        token = req.body.token;
        content = req.body.content;
        conn=await pool.getConnection();
        user = await conn.query("SELECT u.id, u.username FROM sessions s INNER JOIN users u ON s.user_id = u.id WHERE token =?",[token]);
        post = await conn.query("INSERT INTO posts (user_id,content) VALUES (?,?)",[user[0].id,content]);
        err=false;

    }catch(e){
        console.log(e);
        err =true;
    }finally{
        if(conn) conn.end();
        if(!err) return res.json({ "id" : post.insertId ,"userId":user[0].id, "username":user[0].username, "content": content });
        return res.sendStatus(500);
    }
    
})

app.patch('/api/posts',async(req,res)=>{
    

    try{
        token = req.body.token;
        content = req.body.content;
        postId = req.body.postId;
        conn=await pool.getConnection();
        user = await conn.query("SELECT * FROM sessions WHERE token =?",[token]);
        post = await conn.query("SELECT * FROM posts WHERE id = ?",[postId]);
        if ( user[0].user_id == post[0].user_id){
            updatedPost = conn.query("UPDATE posts SET content=? WHERE Id = ?",[content,postId]);
            err= false

        }
        else{
            err=true;
        }
        

    }catch(e){
        console.log(e);
        err =true;
    }finally{
        if(conn) conn.end();
        if(!err) return res.json({ "id" : postId ,  "userId":user[0].user_id , "content": content });
        return res.sendStatus(500);
    }
    
})

app.delete('/api/posts',async(req,res)=>{
    

    try{
        token = req.body.token;
        postId = req.body.postId;
        conn=await pool.getConnection();
        user = await conn.query("SELECT * FROM sessions WHERE token =?",[token]);
        post = await conn.query("SELECT * FROM posts WHERE id = ?",[postId]);
        if ( user[0].user_id == post[0].user_id){
            conn.query("DELETE FROM posts WHERE Id = ?",[postId]);
            err= false

        }
        else{
            err=true;
        }
        

    }catch(e){
        console.log(e);
        err =true;
    }finally{
        if(conn) conn.end();
        if(!err) return res.sendStatus(204)
        return res.sendStatus(500);
    }
    
})

app.post('/api/users',async(req,res)=>{
    

    try{
        username = req.body.username;
        password =req.body.password;
        conn=await pool.getConnection();
        user = await conn.query("INSERT INTO users (username,password) VALUES (?,?)",[username,password]);
        err=false
    }catch(e){
        console.log(e);
        err= true;
        
    }finally{
        if(conn) conn.end();
        if(!err) return res.json({ "id" : user.insertId , "username": username });
        return res.sendStatus(500);
    }
    
})

app.delete('/api/users',async(req,res)=>{
    

    try{
        token = req.body.token;
        conn=await pool.getConnection();
        user = await conn.query("SELECT * FROM sessions WHERE token",[token]);
        await conn.query("DELETE FROM sessions WHERE user_id=?",[user[0].user_id]);
        await conn.query("DELETE FROM users WHERE id =?",[user[0].user_id]);
        err=false
    }catch(e){
        console.log(e);
        err= true;
        
    }finally{
        if(conn) conn.end();
        if(!err) return res.sendStatus(200);
        return res.sendStatus(500);
    }
    
})

app.listen(3000);