const express = require('express');
const router = express.Router();
const builds = require('../controllers/builds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBuild } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Build = require('../models/build');

router.route('/')
    .get(catchAsync(builds.index))
    .post(isLoggedIn, upload.array('image'), validateBuild, catchAsync(builds.createBuild))


router.get('/new', isLoggedIn, builds.renderNewForm)

router.route('/:id')
    .get(catchAsync(builds.showBuild))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBuild, catchAsync(builds.updateBuild))
    .delete(isLoggedIn, isAuthor, catchAsync(builds.deleteBuild));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(builds.renderEditForm))



module.exports = router;
