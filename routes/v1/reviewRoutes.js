const express = require('express');

const { userAuth } = require('../../middlewares/userAuth')
const { getreviews, createReview, deleteReview } = require('../../controllers/reviewController')
const router = express.Router()

// Add review
router.post('/review', userAuth , createReview)

// Get reviews
router.get('/reviews', getreviews)

// Delete a review
router.delete("/reviews/:reviewId", userAuth, deleteReview);

module.exports = {reviewRouter: router}