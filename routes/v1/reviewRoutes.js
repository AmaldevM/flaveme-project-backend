const express = require('express');

const { userAuth } = require('../../middlewares/userAuth')
const { getreviews, createReview } = require('../../controllers/reviewController')
const router = express.Router()

// Add review
router.post('/review', userAuth , createReview)

// Get reviews
router.get('/reviews', getreviews)

module.exports = {reviewRouter: router}