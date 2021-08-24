const Build = require('../models/build');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const build = await Build.findById(req.params.id);
    const review = new Review(req.body.review);
    
    review.author = req.user._id;
    build.reviews.push(review);
    await review.save();
    await build.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/builds/${build._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Build.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/builds/${id}`);
}