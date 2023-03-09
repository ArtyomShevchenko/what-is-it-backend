const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')
const { getDb } = require('./db')

const cors = require("cors")

router.use(express.text())
router.use(express.json())
router.use(cors())

// -------- get data from getDb(MongoDB) -----------
let db;


// ---------------- routes ------------------
router.route('/')
    .get((req, res) => res.status(200).json({ message: "Server work..." }))


    
// get posts
router.route('/posts')
    .get((req, res) => {
        db = getDb()
        const posts = []

        db
            .collection('posts')
            .find()
            .forEach(post => posts.push(post))
            .then(() => {
                res
                    .status(200)
                    .set({
                        "Access-Control-Allow-Origin": "*",
                    })
                    .json(posts)
                console.log("Get all posts")
            })
            .catch(() => {
                res
                    .status(500)
                    .json({ error: "Somthing wrong!" })
            })
    })

    // add new post
    .post((req, res) => {
        db = getDb()

        db
            .collection('posts')
            .insertOne(JSON.parse(req.body))
            .then((result) => {
                res
                    .status(201)
                    .set({
                        "Access-Control-Allow-Origin": "*"
                    })
                    .json(result)

                console.log("Add new post")
            })
            .catch(() => {
                res
                    .status(501)
                    .json({ error: "New post don`t create." })
            })

    })

// get a post according to id 
router.route('/posts/:id')
    .get((req, res) => {
        db = getDb()

        if (ObjectId.isValid(req.params.id)) {
            db
                .collection('posts')
                .findOne({ _id: new ObjectId(req.params.id) })
                .then((post) => {
                    res
                        .status(200)
                        .set({
                            "Access-Control-Allow-Origin": "*",
                        })
                        .json(post)
                    console.log("Get post " + req.params.id)
                })
                .catch(() => {
                    res
                        .status(500)
                        .json({ error: "Somthing wrong!" })
                })
        } else {
            res
                .status(535)
                .json({ error: "wrong id!" })
        }

    })

    // delete post according to id
    .delete((req, res) => {
        db = getDb()

        if (ObjectId.isValid(req.params.id)) {
            db
                .collection('posts')
                .deleteOne({ _id: new ObjectId(req.params.id) })
                .then((result) => {
                    res
                        .status(202)
                        .set({
                            "Access-Control-Allow-Origin": "*",
                        })
                        .json(result)
                    console.log("Delete post " + req.params.id)
                })
                .catch(() => {
                    res
                        .status(502)
                        .json({ error: "Somthing wrong!" })
                })
        } else {
            res
                .status(500)
                .json({ error: "wrong id!" })
        }

    })

    // update post according to id
    .patch((req, res) => {
        db = getDb()

        if (ObjectId.isValid(req.params.id)) {

            console.log(req.body)

            db
                .collection('posts')
                .updateOne(
                    { _id: new ObjectId(req.params.id) },
                    { $set: req.body }

                    // for fetch()
                    // { $set: JSON.parse(req.body) } 
                )
                .then((result) => {
                    res
                        .status(201)
                        .json(result)
                    console.log("Update post " + req.params.id)
                })
                .catch(() => {
                    res
                        .status(501)
                        .json({ error: "Somthing wrong!" })
                })
        } else {
            res
                .status(500)
                .json({ error: "wrong id!" })
        }
    })

router.route('/*')
    .get((req, res) => {
        res.status(404).json({
            message: 'The page does not exist.',
            wrongPath: req.path,
            method: req.method
        })
    })

// add new post
router.route('/contact')
    .post((req, res) => {
        db = getDb()

        db
            .collection('contacts')
            .insertOne(JSON.parse(req.body))
            .then((result) => {
                res
                    .status(201)
                    .set({
                        "Access-Control-Allow-Origin": "*",
                    })
                    .json(result)

                console.log("Add new post")
            })
            .catch(() => {
                res
                    .status(501)
                    .json({ error: "New post don`t create." })
            })

    })

//  -------------- exports ---------------
module.exports = router;