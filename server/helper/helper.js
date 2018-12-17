exports.getReviewsStats = async (listing, numberOfReviews) => {
  const reviewsStat = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  if (numberOfReviews === 0) {
    return {
      reviewsStat,
      numberOfReviewsPerRating: reviewsStat
    }
  }
  const getReviews = listing.reviews.forEach(review => {
    reviewsStat[review.rating]++;
  });
  const cloneGetReviews = { ...reviewsStat
  };
  const modifyReviews = Object.entries(reviewsStat).forEach(review => {
    reviewsStat[review[0]] = Math.trunc((review[1] / numberOfReviews) * 100);;
  });
  return {
    numberOfReviewsPerRating: cloneGetReviews,
    reviewsStat
  }
}

exports.cloudinary = () => {
  const cloud = require('cloudinary');
  cloud.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });
  return cloud;
}

exports.flat = require('flat');