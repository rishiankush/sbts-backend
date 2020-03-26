const { Validator } = require('node-input-validator');
var models = require('../../models/index');
var Candidate = models.candidate;

require('dotenv').config();
var moment = require('moment');
const nodemailer = require("nodemailer");
const Email = require('email-templates');

async function mail(email_template, formData, res) {
    console.log("==========================================",formData);
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
        preview: true,
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
            mail('hello', formData, res);
            console.log("After Mail")
        }
    });
}

const carrers = async (req, res) => {
    if (typeof req.files !== "undefined" && req.files !== null) {
        const formData = req.body;
        formData.cv = req.files.cv;
        console.log('formData ------', formData);
        const validate = new Validator(formData, {
            first_name: 'required|string',
            last_name: 'required|string',
            company_name: 'string',
            address: 'string',
            city: 'string',
            state: 'string',
            postal_code: 'string',
            country: 'string',
            email: 'required|email',
            phone: 'required|integer',
            preferred_contact: 'required|string',
            details: 'required|string',
            cv: 'mime:doc,docx,pdf'
        });
        validate.check().then(async (matched) => {
            if (!matched) {
                res.status(200).json({ statusCode: 400, message: validate.errors });
            } else {
                const full_name = moment().valueOf() + "_" + formData.cv.name;
                formData.cv.mv(appRoot + '/public/resumes/' + full_name, function (err) {
                    if (err) {
                        console.log('upload err', err);
                    } else {
                        formData.cv_path = process.env.CV_UPLOAD_URL + full_name;
                        Candidate.create(formData, async function (err, candidate_reg) {
                            console.log('err ----', err);
                            console.log('candidate_reg ----', candidate_reg);
                            if(candidate_reg){
                                mail('careers', formData, res);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(200).json({ statusCode: 404, message: "Please upload your resume." });
    }
}

module.exports = {
    contact,
    carrers
};
