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

}
main()
