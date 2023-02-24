const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const colors = require("colors");
const cors = require("cors");

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());




//--------- routes start ---------

app.route("/")
    .get((req, res, next) => {
        res.send("Server work...")
        console.log(colors.green(`Entrance to the main route ip:${PORT}/`))
        next()
    })

app.route("/new")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                console.log(colors.green("Send:") + "/new")

                res.send(data)
                next()
            }
        )
    });

app.route("/comments")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                const hasComments = JSON.parse(data).filter(obj => obj.comments)
                const noHasComments = JSON.parse(data).filter(obj => !obj.comments)

                const sortData = hasComments.sort((obj1, obj2) => {
                    return obj2.comments.length - obj1.comments.length
                })

                sortData.push(...noHasComments)

                console.log(colors.green("Send:") + "/comments")

                res.send(JSON.stringify(sortData))
                next()
            }
        )
    });

app.route("/likes")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                const hasLikes = JSON.parse(data).filter(obj => obj.likes)
                const noHasLikes = JSON.parse(data).filter(obj => !obj.likes)

                const sortData = hasLikes.sort((obj1, obj2) => {
                    return obj2.likes - obj1.likes
                })

                sortData.push(...noHasLikes)

                console.log(colors.green("Send:") + "/likes")

                res.send(JSON.stringify(sortData))
                next()
            }
        )
    });

app.route("/views")
    .get((req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) throw err

                const hasViews = JSON.parse(data).filter(obj => obj.views)
                const noHasViews = JSON.parse(data).filter(obj => !obj.views)

                const sortData = hasViews.sort((obj1, obj2) => {
                    return obj2.views - obj1.views
                })

                sortData.push(...noHasViews)

                console.log(colors.green("Send:") + "/views")

                res.send(JSON.stringify(sortData))
                next()
            }
        )
    });

app.route("/new-post")
    .post(upload.any(), (req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) res.sendStatus(410)

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

                res.sendStatus(210)
                console.log(colors.bgGreen('New post: ') + `id:${req.body.id}`)
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
                if (err) res.sendStatus(411);

                JSON.parse(data).filter(post => {
                    if (post.id == req.params.id) {
                        res.send(post)
                        // console.log(colors.green("Get: ") + `/post/${req.params.id}`)
                    }
                })

                next();
            })
    })

    .post(upload.any(), (req, res, next) => {
        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) res.sendStatus(412);

                const newData = [];

                JSON.parse(data).filter(post => {
                    if (post.id != req.params.id) {
                        newData.push(post)
                    }
                });

                JSON.parse(data).filter(post => {
                    if (post.id == req.params.id) {
                        if (post.comments) {
                            post.comments.push(req.body);
                            newData.unshift(post);
                        } else {
                            post.comments = Array(req.body);
                            newData.unshift(post);
                        }
                    }
                });

                fs.writeFile(
                    "./database.json",
                    JSON.stringify(newData),
                    (err) => {
                        if (err) throw err;
                        console.log(colors.green("New comment in ") + `/post/${req.params.id}`);
                    }
                );

                res.sendStatus(212);
                next();
            })
    })

app.route("/post/:id/like")
    .post(upload.any(), (req, res, next) => {
        let id = req.params.id;

        console.log(colors.bgRed(id))

        fs.readFile(
            "./database.json",
            "utf-8",
            (err, data) => {
                if (err) res.sendStatus(413)

                const newData = []

                JSON.parse(data).filter(post => {
                    if (post.id != id) {
                        newData.push(post)
                    }
                })

                JSON.parse(data).filter(post => {
                    if (post.id == id) {
                        if (post.views) {
                            post.likes += 1
                        } else {
                            post.likes = 1
                        }

                        newData.push(post);
                    }
                });

                fs.writeFile(
                    "./database.json",
                    JSON.stringify(newData),
                    (err) => {
                        if (err) throw err;
                        console.log(colors.green("Like: ") + `/post/${id}`);
                    }
                );

                res.sendStatus(213);
                next();
            })
    })

// app.route("/post/:id/view")
//     .post(upload.any(), (req, res, next) => {
//         fs.readFile(
//             "./database.json",
//             "utf-8",
//             (err, data) => {
//                 if (err) res.sendStatus(414)

//                 let id = req.params.id;

//                 const newData = []

//                 JSON.parse(data).filter(post => {
//                     if (post.id != req.params.id) {
//                         newData.push(post)
//                     }
//                 })

//                 JSON.parse(data).filter(post => {
//                     if (post.id == id) {
//                         if (post.views) {
//                             post.views += 1
//                         } else {
//                             post.views = 1
//                         }

//                         newData.unshift(post);
//                     }
//                 });

//                 fs.writeFile(
//                     "./database.json",
//                     JSON.stringify(newData),
//                     (err) => {
//                         if (err) throw err;
//                         console.log(colors.green("View ") + `/post/${id}`);
//                     }
//                 );

//                 res.sendStatus(214);
//                 next();
//             })
//     });

app.route("/contact")
    .post(upload.any(), (req, res, next) => {
        const userName = req.body.name

        fs.readFile(
            "./contact.json",
            "utf-8",
            (err, data) => {
                if (err) res.sendStatus(415)

                const file = JSON.parse(data)
                file.unshift(req.body)

                fs.writeFile(
                    "./contact.json",
                    JSON.stringify(file),
                    err => {
                        if (err) throw err
                        console.log(colors.bgGreen(`New contact: ${userName}`))
                    }
                )

                res.sendStatus(230)
                next()
            });

    })




// ---------- listen --------------

app.listen(3000, () => console.log(colors.bold.magenta("Server work on ") + colors.blue("==> ") + colors.bgMagenta(`http://localhost:${PORT}`)));




// -------- respons status --------

// 210 - /new-post create ok
// 410 - /new-post create !

// 211 - /post/:id get ok
// 411 - /post/:id get !

// 212 - /post/:id post ok
// 412 - /post/:id post !

// 213 - /post/:id/like ok
// 413 - /post/:id/like !

// 214 - /post/:id/view ok
// 414 - /post/:id/view !

// 215 - /contact ok
// 415 - /contact !