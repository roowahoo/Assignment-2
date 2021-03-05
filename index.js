const express = require ('express')
require('dotenv').config();
const mongoUrl=process.env.MONGO_URL
const MongoUtil = require ('./MongoUtil')
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors')

let app = express()

app.use(express.json())
app.use(cors())

async function main(){
    let db=await MongoUtil.connect(mongoUrl, 'dating_app')

    app.get('/profiles',async (req,res)=>{
        let results=await db.collection('profiles').find({}).toArray()
        res.status(200)
        res.send(results)
    })

    app.get('/conversations',async (req,res)=>{
        let results=await db.collection('connections').find({}).toArray()
        res.status(200)
        res.send(results)
    })

    app.get('/matches',async (req,res)=>{
        let results=await db.collection('stars').find({}).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/profiles', async (req,res)=>{
        let account_id=req.body.account_id
        let name=req.body.name;
        let age=req.body.age;
        let gender=req.body.gender;
        let interests=req.body.interests;
        let contact=req.body.contact;
        let likes=req.body.likes;
        let introduction=req.body.introduction

        try{
            let result= await db.collection('profiles').insertOne({
                account_id:account_id,
                name:name,
                age:age,
                gender:gender,
                interests:interests,
                contact:contact,
                likes:likes,
                introduction:introduction
            })
            res.status(200)
            res.send(result)
        }catch(e){
            res.status(500)
            res.send({
                error:'Internal server error'
            })
            console.log(e)
        }
    })

    app.post('/conversations', async (req,res)=>{
        let conversation_id=req.body.conversation_id
        let users_ids=req.body.users_id;
        

        try{
            let result=db.collection('conversations').insertOne({
                conversation_id:conversation_id,
                users_id:users_ids
            })
            res.status(200)
            res.send(result)
        }catch(e){
            res.status(500)
            res.send({
                error:'Internal server error'
            })
            console.log(e)
        }
    })

    app.post('/matches', async (req,res)=>{
        let matched_id=req.body.matched_id
        let users_ids=req.body.users_id;
        

        try{
            let result=db.collection('matches').insertOne({
                matched_id:matched_id,
                users_id:users_ids
            })
            res.status(200)
            res.send(result)
        }catch(e){
            res.status(500)
            res.send({
                error:'Internal server error'
            })
            console.log(e)
        }
    })

    app.delete('/profiles/:id', async (req,res)=>{
        await db.collection('profiles').deleteOne({
            _id:ObjectId(req.params.id)
        })
        res.status(200)
        res.send({
            'message':'deleted'
        })
    })


}
main()

app.listen(3001,()=>{
    console.log('Server has started')
})
