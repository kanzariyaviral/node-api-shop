const mongoose = require('mongoose')
const User = require('../model/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWK_KEY } = require('../config/config')
let nodemailer = require('nodemailer');

exports.signup = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(404).json({
                    message: "email already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json(
                            { error: err }
                        )
                    } else {

                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {

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
                                    text: `you are create account in nodejs-api-shop`
                                  };
                                  
                                  transporter.sendMail(mailOptions,(error, info)=>{
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);
                                    }
                                  });


                                console.log(result);
                                res.status(201).json({
                                    success: "User create"
                                })
                            }
                            ).catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        })
}


exports.signin = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed'
                        })
                    }
                    if (result) {

                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                userId: user[0]._id

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
                    res.status(401).json({
                        message: 'Auth failed'
                    })
                })

            }
        })
}

exports.userdelete = (req, res) => {
    User.remove({
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

