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

    app.post('/searchbygender', async (req, res) => {
        let results = await db.collection('profiles').find({

            gender: req.body.gender

        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/searchbyage', async (req, res) => {
        let results = await db.collection('profiles').find({
            age: {
                '$gte': parseInt(req.body.age),
                '$lt': parseInt(req.body.age) + 10
            }
        }).toArray()
        res.status(200)
        console.log(results)
        res.send(results)
    })

    app.post('/searchbyinterests', async (req, res) => {
        let results = await db.collection('profiles').find({
            interests: {
                '$in': req.body.interests
            }
        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/searchbyall', async (req, res) => {
        let results = await db.collection('profiles').find({
            age: {
                '$gte': parseInt(req.body.age),
                '$lte': parseInt(req.body.age) + 10
            },
            interests: {
                '$in': req.body.interests
            },
            gender: req.body.gender
        }).toArray()
        res.status(200)
        console.log(results)
        res.send(results)
    })

    app.post('/searchbygenderage', async (req, res) => {
        let results = await db.collection('profiles').find({

            gender: req.body.gender,
            age: {
                '$gte': parseInt(req.body.age),
                '$lt': parseInt(req.body.age) + 10
            }
        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/searchbygenderinterests', async (req, res) => {
        let results = await db.collection('profiles').find({

            gender: req.body.gender,
            interests: {
                '$in': req.body.interests
            }
        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/searchbyageinterests', async (req, res) => {
        let results = await db.collection('profiles').find({

            age: {
                '$gte': parseInt(req.body.age),
                '$lt': parseInt(req.body.age) + 10
            },
            interests: {
                '$in': req.body.interests
            }
        }).toArray()
        res.status(200)
        res.send(results)
    })

    app.post('/profiles', async (req, res) => {
        let name = req.body.name;
        let gender = req.body.gender;
        let dob = req.body.dob;
        let age = req.body.age;
        let interests = req.body.interests;
        let introduction = req.body.introduction;
        let image = req.body.image_url

        try {
            let result = await db.collection('profiles').insertOne({
                name: name,
                gender: gender,
                dob: dob,
                age: age,
                interests: interests,
                introduction: introduction,
                image: image
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
                    user_id: ObjectId(req.body.user_id),
                    name: req.body.name
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

    app.post('/findProfile', async (req, res) => {
        let user_id = ObjectId(req.body.user_id)
        console.log(user_id)
        let foundUser = await db.collection('profiles').findOne({ _id: user_id })
        console.log(foundUser)
        res.status(200)
        res.send(foundUser)
    })

    app.post('/searchUsernames', async (req, res) => {
        let username = req.body.username
        let foundUser = await db.collection('usernames').findOne({ username: username })
        if (foundUser != null) {
            res.status(200)
            res.send(foundUser)
        } else {
            res.send('no username found')
        }
    })

    app.put('/editProfile', async (req, res) => {
        try {
            await db.collection('profiles').updateOne({
                _id: ObjectId(req.body.user_id)
            }, {
                $set: {
                    name: req.body.name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    age: req.body.age,
                    interests: req.body.interests,
                    introduction: req.body.introduction
                }
            })

            res.status(200)
            res.send('updated')
        } catch (e) {
            res.status(500)
            res.send({
                'message': 'Unable to update profile'
            })
            console.log(e)

        }
    })

    // app.put('/editUsername', async (req, res) => {
    //     try {
    //         await db.collection('usernames').updateOne({
    //             user_id: ObjectId(req.body.user_id)
    //         }, {
    //             $set: {
    //                 username: req.body.username
    //             }
    //         })
    //         res.status(200)
    //         res.send('updated')
    //     } catch (e) {
    //         res.status(500)
    //         res.send({
    //             'message': 'Unable to update username'
    //         })
    //         console.log(e)

    //     }
    // })

    app.post('/conversations', async (req, res) => {
        let user_id = req.body.user_id
        let user_name = req.body.user_name
        let user2_id = req.body.user2_id
        let user2_name = req.body.user2_name
        let result = await db.collection('conversations').insertOne({
            user_id: user_id,
            user_name: user_name,
            user2_id: user2_id,
            user2_name: user2_name,
            messages: []
        })
        res.status(200)
        res.send(result)
    })

    app.post('/findConversations', async (req, res) => {
        let user_id = req.body.user_id
        let foundConversation = await db.collection('conversations').find({
            $or: [
                { user_id: user_id },
                { user2_id: user_id }
            ]
        }).toArray()
        res.status(200)
        res.send(foundConversation)
    })



    app.put('/conversations', async (req, res) => {
        try {
            await db.collection('conversations').updateOne({
                _id: ObjectId(req.body.conversationId)
            }, {
                $push: {
                    messages: req.body.message
                }
            })
            res.status(200)
            res.send('Message sent')
        } catch (e) {
            res.status(500)
            res.send({
                'error': 'Unable to send message'
            })

        }
    })


    app.delete('/deleteProfile/:user_id', async (req, res) => {
        try {
            await db.collection('profiles').deleteOne({
                _id: ObjectId(req.params.user_id)
            })
            res.status(200)
            res.send({
                'message': 'deleted'
            })

        } catch (e) {
            res.status(500)
            res.send({
                'message': 'Unable to delete'
            })
        }

    })

    app.delete('/deleteUsername/:user_id', async (req, res) => {
        await db.collection('usernames').deleteOne({
            user_id: ObjectId(req.params.user_id)
        })
        res.status(200)
        res.send({
            'message': 'deleted'
        })
    })
}
main()

app.listen(3001, () => {
    console.log('Server has started')
})
