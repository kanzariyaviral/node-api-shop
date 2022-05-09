const mongoose = require('mongoose')
const User = require('../model/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWK_KEY } = require('../config/config')
let nodemailer = require('nodemailer');
const { query } = require('express');

const vname = /^[a-zA-Z]*$/;
const vemail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const vpassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/


exports.signup = async (req, res) => {
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                return res.status(404).json({
                    message: "email already exists"
                });
            }
            else if (!name.match(vname)) {
                return res.status(404).json({
                    message: "Please Enter Valide Name"
                });
            }
            else if (!email.match(vemail)) {
                return res.status(404).json({
                    message: "Please Enter Valide Email"
                });
            }
            else if (!password.match(vpassword)) {
                return res.status(404).json({
                    message: "password contain lowwercase,uppercase,number,symbol and more then 8 character"
                });
            }
            else {

                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {

                        return res.status(500).json(
                            { error: err }
                        )
                    } else {
                        const otp = Math.floor(100000 + Math.random() * 900000);
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            verfication_token: otp
                        });
                        user.save()
                            .then(result => {
                                const uemail = result.email;
                                const uname = result.name;
                                let transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'viralgtcsys@gmail.com',
                                        pass: 'ViralG@123'
                                    }
                                });

                                let mailOptions = {
                                    from: 'viralgtcsys@gmail.com',
                                    to: result.email,
                                    subject: 'create account ',
                                    html: `<div class="center" style="border-radius:5px;margin:0 auto;background-color:#e8e8e8;padding: 20px;width: 450px;text-align: center;">
                                    <form><h1 align="center">just one more step...</h1>
                                    <p align="center"><b align="center">${uname}</b></p>
                                    <p align="center">Click the button below to active your node-api-shop account</p>
                                    <a href="https://node-rest-shop.herokuapp.com/user/verify/query?email=${uemail}&token=${otp}"><button style="background-color:#008CBA;margin-left:auto;margin-right:auto;display:block;margin-top:auto;margin-bottom:0%">Active Account</button>
                                    </form></div>`

                                };

                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });


                                console.log(result);
                                res.status(201).json({
                                    success: "User create",
                                    message: "please check your email for verification"
                                })
                            }
                            ).catch(err => {
                                console.log({
                                    error: err
                                })
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })


            }
        })
}

//with .then() promise code lenth is big 

// exports.signin = async (req, res) => {
//     await User.find({ email: req.body.email })
//         .exec()
//         .then(user => {
//             var activeToken = user.activeToken
//             if (user.length < 1) {
//                 return res.status(401).json({
//                     message: 'Auth failed'
//                 })
//             }
//             else {
//                 if (activeToken === false) {
//                     return res.status(401).json({
//                         message: 'please verify your account'
//                     })
//                 }
//                 bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//                     if (err) {
//                         return res.status(401).json({
//                             message: 'Auth failed'
//                         })
//                     }
//                     if (result) {

//                         const token = jwt.sign(
//                             {
//                                 email: user[0].email,
//                                 userId: user[0]._id

//                             },
//                             JWK_KEY,
//                             {
//                                 expiresIn: "1h"
//                             }

//                         )
//                         return res.status(200).json({
//                             message: 'Auth successful',
//                             token: token
//                         });
//                     }
//                     res.status(401).json({
//                         message: 'Auth failed'
//                     })
//                 })

//             }
//         })
// }

exports.signIn = async (req, res) => {
    // signIn with try catch
    try {
        const result = await User.findOne({ email: req.body.email }).exec()
        if (result) {
            const match = await bcrypt.compare(req.body.password, result.password);
            if (match) {
                const token = jwt.sign({
                    email: result.email, userId: result._id

                },
                    JWK_KEY,
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
        }

        throw Error('Auth unsuccessful please check oyur mail')
    }
    catch(error) {
        return res.status(400).json({
            message: error.message,
        });

    }

    
}


exports.verify = async (req, res) => {
    var { email, Token } = req.query;
    let user = await User.find({ email: email })
    if (user) {
        if (user.verfication_token == Token) {
            if (user.activeToken == true) {
                return res.status(400).json("your account is already verfiyed")
            }
            var myquery = { email: email }
            var newvalues = { $set: { activeToken: true } };
            User.updateOne(myquery, newvalues, (err, res) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ err: err })
                }
                console.log("update")
            })
            res.status(200).json({ success: "verification successfull" })
        } else {
            res.status(404).json({ failed: "verification failed" })
        }

    }
}




exports.userdelete = async (req, res) => {
    await User.remove({
        _id: req.params.id
    })
        .then(() => {
            res.status(200).json({
                message: "user deleted successfully"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}
