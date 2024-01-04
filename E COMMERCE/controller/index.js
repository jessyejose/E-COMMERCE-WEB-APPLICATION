const express = require('express')
const router = express.Router()

const admin= require('./adminPortal')
const user=require('./userPortal')

router.use('/admin',admin)
router.use('/',user)

module.exports= router;