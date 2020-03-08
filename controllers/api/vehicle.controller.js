const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var moment = require('moment');
const { Validator } = require('node-input-validator');
var models = require('../../models/index');
var Vehcl = models.vehicle_specs;
require('dotenv').config();
var moment = require('moment');
var Sequelize = require("sequelize");
// const Op = require('sequelize').Op;

const create = async (req, res) => {
    const vehicleData = req.body;
    const validate = new Validator(vehicleData, {
        chasis_no: 'required',
        name: 'required|string',
        model: 'required',
        colour: 'required|string',
        engine_displacement: 'required',
        average: 'required',
        engine_type: 'required',
    });
    validate.check().then(async (matched) => {
        if (!matched) {
            res.status(400).json({ statusCode: 400, message: validate.errors });
        } else {
            try {
                const form = await Vehcl.findOrCreate({
                    where: { chasis_no: vehicleData.chasis_no },
                    defaults: vehicleData
                }).spread(async function (user, created) {
                    if (created) {
                        res.status(201).json({ statusCode: 201, message: 'inserted successfully.', data: user });
                    } else {
                     

                        Vehcl.update(vehicleData, {
                            where: { chasis_no: user.dataValues.chasis_no },
                            returning: true,
                            plain: true
                          }).then(function (result) {
                            console.log('result -----', result);   
                            res.status(201).json({ statusCode: 201, messaage: 'updated successfully.', data: vehicleData });
                          });

                    }
                })
            }
            catch (mysql_error) {
                res.status(200).json({ statusCode: 400, message: mysql_error });
            }
        }
    });
};

module.exports = {
    create
};
