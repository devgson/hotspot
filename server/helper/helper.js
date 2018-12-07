exports.getReviewsStats = async (listing, numberOfReviews) => {
  const reviewsStat = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
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