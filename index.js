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
    let db=await MongoUtil.connect(mongoUrl, 'profiles')

    app.get('/profiles',async (req,res)=>{
        let results=await db.collection('profiles').find({}).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/profiles', async (req,res)=>{
        let name=req.body.name;
        let age=req.body.age;
        let gender=req.body.gender;
        let interests=req.body.interests;
        let contact=req.body.contact

        try{
            let result=db.collection('profiles').insertOne({
                name:name,
                age:age,
                gender:gender,
                interests:interests,
                contact:contact
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

}
main()

app.listen(3001,()=>{
    console.log('Server has started')
})
