const express = require('express')
require('dotenv').config();
const mongoUrl = process.env.MONGO_URL
const MongoUtil = require('./MongoUtil')
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors')

let app = express()

app.use(express.json())
app.use(cors())

async function main() {
    let db = await MongoUtil.connect(mongoUrl, 'dating_app')

    app.get('/profiles', async (req, res) => {
        let results = await db.collection('profiles').find({}).toArray()
        res.status(200)
        res.send(results)
    })

    // app.get('/conversations',async (req,res)=>{
    //     let results=await db.collection('connections').find({}).toArray()
    //     res.status(200)
    //     res.send(results)
    // })

    app.post('/searchbygender', async (req, res) => {
        let results = await db.collection('profiles').find({
            $or: [
                { gender: req.body.gender }
            ]
        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/searchbyage', async (req, res) => {
        let results = await db.collection('profiles').find({
            age:{
                '$gte':parseInt(req.body.age),
                '$lte':30
            }
        }).toArray()
        res.status(200)
        console.log(results)
        res.send(results)
    })

    app.post('/searchbyinterests', async (req, res) => {
        let results = await db.collection('profiles').find({
            interests:{
                '$in':req.body.interests
            } 
        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/profiles', async (req, res) => {
        let name = req.body.name;
        let gender = req.body.gender;
        let age = req.body.age;
        let interests = req.body.interests;
        let introduction = req.body.introduction;

        try {
            let result = await db.collection('profiles').insertOne({
                name: name,
                gender: gender,
                age: age,
                interests: interests,
                introduction: introduction
            })
            res.status(200)
            res.send(result)
        } catch (e) {
            res.status(500)
            res.send({
                error: 'Internal server error'
            })
            console.log(e)
        }
    })

    app.post('/usernames', async (req, res) => {
        let username = req.body.username
        let foundUser = await db.collection('usernames').findOne({ username: username })
        if (foundUser != null) {
            res.status(500)
            res.send({
                error: 'Username has been taken'
            })

        } else {
            try {
                let result = await db.collection('usernames').insertOne({
                    username: username,
                    user_id: ObjectId(req.body.user_id)
                })
                res.status(200)
                res.send(result)
            } catch (e) {
                res.status(500)
                res.send({
                    error: 'Internal server error'
                })
                console.log(e)
            }

        }

    })

    app.post('/conversations', async (req, res) => {
        let users_ids = req.body._id;
        let messages = req.body.message


        try {
            let result = db.collection('conversations').insertOne({
                users_id: users_ids,

            })
            res.status(200)
            res.send(result)
        } catch (e) {
            res.status(500)
            res.send({
                error: 'Internal server error'
            })
            console.log(e)
        }
    })

    app.post('/matches', async (req, res) => {
        let matched_id = req.body.matched_id
        let users_ids = req.body.users_id;


        try {
            let result = db.collection('matches').insertOne({
                matched_id: matched_id,
                users_id: users_ids
            })
            res.status(200)
            res.send(result)
        } catch (e) {
            res.status(500)
            res.send({
                error: 'Internal server error'
            })
            console.log(e)
        }
    })

    app.delete('/profiles/:id', async (req, res) => {
        await db.collection('profiles').deleteOne({
            _id: ObjectId(req.params.id)
        })
        res.status(200)
        res.send({
            'message': 'deleted'
        })
    })

    // app.put('/profiles')


}
main()

app.listen(3001, () => {
    console.log('Server has started')
})
