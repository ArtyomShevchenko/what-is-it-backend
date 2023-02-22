const express = require("express")
const app = express()
const PORT = 3000
const fs = require("fs")
const colors = require("colors")
const cors = require("cors")

const multer = require("multer")
const upload = multer({ dest: "./uploads" })

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

//--------- routes start ---------
 
app.route("/")
    .get((req, res, next) => {
        res.send("Server work...")
        next()
    })

app.route("/all")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                res.send(data)
                next()
            }
        )
    })

app.route("/new-post")
    .post(upload.any(), (req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                const arr = JSON.parse(data)

                // add id to post
                req.body.id = Number(Date.now())

                // add create time
                req.body.time = Date()

                arr.unshift(req.body)

                fs.writeFile(
                    "./database.json",
                    JSON.stringify(arr),
                    (err) => {
                        if (err) throw err
                    }
                )

                res.sendStatus(235)
                next()
            }
        )
    })

app.route("/post/:id")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                JSON.parse(data).filter(post => {
                    if (post.id == req.params.id) {
                        res.send(post)
                    }
                })
            })
    })

    .post(upload.any(), (req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err
                const newData = []

                JSON.parse(data).filter(post => {
                    if (post.id != req.params.id) {
                        newData.push(post)
                    }
                })

                JSON.parse(data).filter(post => {
                    if (post.id == req.params.id) {
                        if (post.comments) {
                            post.comments.push(req.body)
                            newData.push(post)
                        } else {
                            post.comments = Array(req.body)
                            newData.push(post)
                        }
                    }
                })

                fs.writeFile(
                    "./database.json",
                    JSON.stringify(newData),
                    (err) => { if (err) throw err }
                )

                res.sendStatus(200)
                next()
            })
    });

app.route("/top")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                const sortData = JSON.parse(data)
                sortData.sort();

                console.log(sortData)

                res.send(data)
                next()
            }
        )
    })

app.route("/contact")
    .post(upload.any(), (req, res, next) => {
        const userName = req.body.name

        fs.readFile(
            "./contact.json",
            "utf-8",
            (err, data) => {
                if (err) console.log(err)

                const file = JSON.parse(data)
                file.unshift(req.body)

                fs.writeFile(
                    "./contact.json",
                    JSON.stringify(file),
                    err => {
                        if (err) console.log(err)
                        console.log(colors.bgGreen(`New contact: ${userName}`))
		    }
                )
            });

        res.sendStatus(235)
        next()
    })

// ---------- routes end --------------

app.listen(3000, () => console.log(colors.bold.magenta("Server work on ") + colors.blue("==> ") + colors.bgMagenta(`http://localhost:${PORT}`)))
