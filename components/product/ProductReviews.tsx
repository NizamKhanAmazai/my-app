import React from 'react';

interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    user: 'Sarah Jenkins',
    rating: 5,
    title: 'Exceeded my expectations!',
    comment: 'The quality is absolutely top-notch. I was hesitant at first given the price, but it is worth every penny. The finish is beautiful and it feels very premium.',
    date: 'Oct 12, 2023',
    isVerified: true,
  },
  {
    id: '2',
    user: 'Michael Chen',
    rating: 4,
    title: 'Great design, fast shipping',
    comment: 'The product arrived two days early. The packaging was secure and the setup was intuitive. Only giving 4 stars because the color is slightly darker than the photos.',
    date: 'Oct 08, 2023',
    isVerified: true,
  },
  {
    id: '3',
    user: 'Elena Rodriguez',
    rating: 5,
    title: 'Perfect for my daily routine',
    comment: 'I use this every single day now. It has completely streamlined my workflow. If you are on the fence, just get it. You won’t regret the investment.',
    date: 'Sep 29, 2023',
    isVerified: true,
  },
  {
    id: '12',
    user: 'Sarah Jenkins',
    rating: 5,
    title: 'Exceeded my expectations!',
    comment: 'The quality is absolutely top-notch. I was hesitant at first given the price, but it is worth every penny. The finish is beautiful and it feels very premium.',
    date: 'Oct 12, 2023',
    isVerified: true,
  },
  {
    id: '22',
    user: 'Michael Chen',
    rating: 4,
    title: 'Great design, fast shipping',
    comment: 'The product arrived two days early. The packaging was secure and the setup was intuitive. Only giving 4 stars because the color is slightly darker than the photos.',
    date: 'Oct 08, 2023',
    isVerified: true,
  },
  {
    id: '32',
    user: 'Elena Rodriguez',
    rating: 5,
    title: 'Perfect for my daily routine',
    comment: 'I use this every single day now. It has completely streamlined my workflow. If you are on the fence, just get it. You won’t regret the investment.',
    date: 'Sep 29, 2023',
    isVerified: true,
  },
  {
    id: '11',
    user: 'Sarah Jenkins',
    rating: 5,
    title: 'Exceeded my expectations!',
    comment: 'The quality is absolutely top-notch. I was hesitant at first given the price, but it is worth every penny. The finish is beautiful and it feels very premium.',
    date: 'Oct 12, 2023',
    isVerified: true,
  },
  {
    id: '21',
    user: 'Michael Chen',
    rating: 4,
    title: 'Great design, fast shipping',
    comment: 'The product arrived two days early. The packaging was secure and the setup was intuitive. Only giving 4 stars because the color is slightly darker than the photos.',
    date: 'Oct 08, 2023',
    isVerified: true,
  },
  {
    id: '31',
    user: 'Elena Rodriguez',
    rating: 5,
    title: 'Perfect for my daily routine',
    comment: 'I use this every single day now. It has completely streamlined my workflow. If you are on the fence, just get it. You won’t regret the investment.',
    date: 'Sep 29, 2023',
    isVerified: true,
  },
  {
    id: '121',
    user: 'Sarah Jenkins',
    rating: 5,
    title: 'Exceeded my expectations!',
    comment: 'The quality is absolutely top-notch. I was hesitant at first given the price, but it is worth every penny. The finish is beautiful and it feels very premium.',
    date: 'Oct 12, 2023',
    isVerified: true,
  },
  {
    id: '221',
    user: 'Michael Chen',
    rating: 4,
    title: 'Great design, fast shipping',
    comment: 'The product arrived two days early. The packaging was secure and the setup was intuitive. Only giving 4 stars because the color is slightly darker than the photos.',
    date: 'Oct 08, 2023',
    isVerified: true,
  },
  {
    id: '321',
    user: 'Elena Rodriguez',
    rating: 5,
    title: 'Perfect for my daily routine',
    comment: 'I use this every single day now. It has completely streamlined my workflow. If you are on the fence, just get it. You won’t regret the investment.',
    date: 'Sep 29, 2023',
    isVerified: true,
  },
];

const StarIcon = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ReviewCard = ({ review }: { review: Review }) => {
  const initials = review.user.split(' ').map(n => n[0]).join('');

  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 ease-out hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {initials}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  filled={i < review.rating} 
                  className={`w-3 h-3 ${i < review.rating ? 'text-orange-500' : 'text-gray-200'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium">{review.date}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h5 className="font-bold text-gray-800 leading-tight">{review.title}</h5>
          {review.isVerified && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-50 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {review.comment}
        </p>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-orange-500/0 group-hover:ring-orange-500/10 transition-all duration-300" />
    </div>
  );
};

const ProductReviews: React.FC = () => {
  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-orange-100 pb-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Customer <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-yellow-500">Reviews</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Real feedback from our community of verified buyers. We let the quality speak for itself.
            </p> 
          </div>

          <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-orange-50">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 leading-none mb-1">{averageRating}</div>
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    filled={i < Math.floor(Number(averageRating))} 
                    className="w-4 h-4 text-orange-500" 
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average</p>
            </div>
            <div className="w-px h-12 bg-orange-100" />
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 leading-none mb-1">{reviews.length}</div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white transition-all duration-200 bg-linear-to-r from-orange-500 to-yellow-500 rounded-full hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;