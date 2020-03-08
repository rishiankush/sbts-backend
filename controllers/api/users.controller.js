const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
const bcrypt = require('bcrypt');
var models = require('../../models/index');
var User = models.user;
var Image = models.image;

require('dotenv').config();
var moment = require('moment');
var Sequelize = require("sequelize");
const Op = require('sequelize').Op;
const nodemailer = require("nodemailer");
const Email = require('email-templates');


const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const updateSocialId = (res, formData) => {
    var social_id, query;
    if ('facebook_id' in formData) {
        social_id = formData.facebook_id;
        query = { facebook_id: social_id }
    } else if ('twitter_id' in formData) {
        social_id = formData.twitter_id;
        query = { twitter_id: social_id }
    }

    User.update(formData, { returning: true, where: { email: formData.email } })
        .then(function ([rowsUpdate, updatedUser]) {
            if (updatedUser) {
                res.status(200).json({ statusCode: 422, message: "user already exists.", data: rowsUpdate });
            } else {
                res.status(200).json({ statusCode: 400, message: "error while creating user.", data: rowsUpdate });
            }
        });
};

const saveMultipleImage = (req, user_id) => {
    var files = req.files.profile_img;
    var files_length = files.length;
    console.log('length ------', files_length);
    if (typeof files_length !== "undefined") {
        for (let i = 0; i < Object.keys(files).length; i++) {
            const full_name = moment().valueOf() + "_" + files[i].name;
            files[i].mv(appRoot + '/public/images/profile/' + full_name, function (err) {
                if (err) {
                    console.log('upload err', err);
                } else {
                    files[i].path = process.env.PROFILE_IMG_URL + full_name;
                    files[i].user_id = user_id;
                    Image.create(files[i], async function (err, img) {
                        console.log('err ----', err);
                        console.log('img ----', img);
                    });
                }
            });
        }
    } else {
        const full_name = moment().valueOf() + "_" + files.name;
        files.mv(appRoot + '/public/images/profile/' + full_name, function (err) {
            if (err) {
                console.log('upload err', err);
            } else {
                files.path = process.env.PROFILE_IMG_URL + full_name;
                files.user_id = user_id;
                Image.create(files, async function (err, img) {
                    console.log('err ----', err);
                    console.log('img ----', img);
                });
            }
        });
    }
};

const signup = async (req, res) => {
    const formData = req.body;
    const validate = new Validator(formData, {
        email: 'required|email',
        full_name: 'required|string',
        phone_number: 'required|integer',
        address: 'required|string',
        dob: 'required|dateFormat:YYYY-MM-DD',
        gender: 'required|string',
        password: 'required|string',
        lat: 'required|decimal',
        lng: 'required|decimal'
    });
    validate.check().then(async (matched) => {
        if (!matched) {
            res.status(200).json({ statusCode: 400, message: validate.errors });
        } else {
            try {
                formData.password = createHash(formData.password);
                User.findOrCreate({
                    where: {
                        [Op.or]: [
                            { phone_number: formData.phone_number },
                            { email: formData.email }
                        ]
                    },
                    defaults: formData
                }).spread(function (userResult, created) {
                    if (created) {
                        //upload code for profile images
                        if (!req.files || Object.keys(req.files).length === 0) {
                            res.status(200).json({ statusCode: 400, message: "No files were uploaded.", data: "" });
                        } else {
                            saveMultipleImage(req, userResult.id);
                        }
                        var data = userResult.toJSON();
                        delete data.password;
                        res.status(200).json({ statusCode: 200, message: "user created successfully.", data: data });
                    } else {
                        var data = userResult.toJSON();
                        delete data.password;
                        res.status(200).json({ statusCode: 422, message: "user already exists.", data: data });
                    }
                });
            } catch (mysql_error) {
                res.status(200).json(mysql_error);
            }
        }
    });
};

const socialSignup = async (req, res) => {
    const formData = req.body;
    const validate = new Validator(formData, {
        email: 'required|email',
        full_name: 'string',
        facebook_id: 'string',
        twitter_id: 'string',
        phone_number: 'integer',
        address: 'string',
        dob: 'dateFormat:YYYY-MM-DD',
        gender: 'string',
        password: 'string',
        lat: 'decimal',
        lng: 'decimal',
        path: 'url'
    });
    validate.check().then(async (matched) => {
        if (!matched) {
            res.status(200).json({ statusCode: 400, message: validate.errors });
        } else {
            try {
                User.findOrCreate({
                    where: {
                        [Op.or]: [
                            { email: formData.email }
                        ]
                    },
                    defaults: formData
                }).spread(function (userResult, created) {
                    if (formData.profile_img_url) {
                        console.log("in");
                        var raw_data = ({ user_id: userResult.id, path: formData.path });
                        console.log('test ----', raw_data);
                        Image.create(raw_data, function (err, img) {
                            console.log('err ----', err);
                            console.log('img ----', img);
                        });
                    }

                    if (created) {
                        res.status(200).json({ statusCode: 200, message: "user created successfully.", data: userResult });
                    } else {
                        updateSocialId(res, formData);
                    }
                });
            } catch (mysql_error) {
                res.status(200).json(mysql_error);
            }
        }
    });
};

const login = async (req, res) => {
    const formData = req.body;
    const validate = new Validator(formData, {
        email: 'required|string',
        password: 'required|string'
    });
    validate.check().then((matched) => {
        if (!matched) {
            res.status(200).json({ statusCode: 400, message: validate.errors });
        } else {
            try {
                User.findOne({
                    where: {
                        email: formData.email
                    }
                }).then((user) => {
                    console.log('user ------', user);
                    if (!user) {
                        res.status(200).send({ status: 401, message: 'Authentication failed. User not found.' });
                    } else {
                        user.verifyPassword(formData.password, (err, isMatch) => {
                            console.log("err -----", err);
                            console.log("isMatch ------", isMatch);
                            /*if (isMatch && !err) {
                                var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', { expiresIn: 86400 * 30 });
                                jwt.verify(token, 'nodeauthsecret', function (err, data) {
                                    console.log("jwt error -----", err);
                                    console.log("jwt data -----", data);
                                    res.status(200).json({ token: token, statusCode: 200, message: "logged in successfully.", data: "" });
                                });
                            } else {
                                res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                            } */
                        })
                    }
                });
            } catch (mysql_error) {
                res.status(200).json(mysql_error);
            }
        }
    });
};

const checkUserExists = async (req, res) => {
    const formData = req.body;
    const validate = new Validator(formData, {
        email: 'required|email'
    });
    validate.check().then(async (matched) => {
        if (!matched) {
            res.status(200).json({ statusCode: 400, message: validate.errors });
        } else {
            try {
                const user = await User.findOne({ where: { email: formData.email } });
                if (user === null) {
                    res.status(200).json({ statusCode: 400, message: "user not found." });
                } else {
                    res.status(200).json({ statusCode: 422, message: "user already exists." });
                }
            } catch (mysql_error) {
                res.status(200).json(mysql_error);
            }
        }
    });
}

async function mail(email_template, formData, res) {
    console.log("==========================================");
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        // service: 'Gmail',
        auth: {
            user: 'ankushrishi5@gmail.com', // generated ethereal user
            pass: 'Code@mateur123#$#', // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    const email = new Email({
        transport: transporter,
        send: true,
        preview: false,
      });
  
      email.send({
        template: email_template,
        message: {
          from: 'SBTS <no-reply@stbs.com>',
          to: formData.email,
        },
        locals: {
            formData: formData
        }
      }).then(() => {
          console.log('checking console here ******** ')
            res.status(200).json({ statusCode: 200, message: 'email has been sent!' });
        });
    
}

const contact = async (req, res) => {
    const formData = req.body;
    const validate = new Validator(formData, {
        first_name: 'required|string',
        last_name: 'string',
        email: 'required|email',
        phone: 'required|integer',
        message: 'required|string',
        html_data: 'string'
    });
    validate.check().then(async (matched) => {
        if (!matched) {
            res.status(200).json({ statusCode: 400, message: validate.errors });
        } else {
            console.log("Before Mail")
            mail('hello',formData, res);
            console.log("After Mail")
        }
    });
}

const carrers = async (req, res) => {
    const formData = req.body;
    const validate = new Validator(formData, {
        first_name: 'required|string',
        last_name: 'required|string',
        company_name: 'required|string',
        address: 'required|string',
        city: 'required|string',
        state: 'required|string',
        postal_code: 'required|string',
        country: 'required|string',
        email: 'required|email',
        phone: 'required|integer',
        details: 'required|string'
    });
    validate.check().then(async (matched) => {
        if (!matched) {
            res.status(200).json({ statusCode: 400, message: validate.errors });
        } else {
            console.log("Before Mail")
            mail('careers',formData, res);
            console.log("After Mail")
        }
    });
}

module.exports = {
    signup,
    socialSignup,
    login,
    checkUserExists,
    contact,
    carrers
};
