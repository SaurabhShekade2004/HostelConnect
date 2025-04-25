export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science, 3rd Year",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "Living in this hostel has been an amazing experience. The facilities are top-notch and the staff is always helpful. I've made lifelong friends here!",
      rating: 5
    },
    {
      name: "Rahul Patel",
      role: "Mechanical Engineering, 2nd Year",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "The study environment here is perfect for academic success. I've improved my grades significantly since moving into this hostel.",
      rating: 4.5
    },
    {
      name: "Neha Gupta",
      role: "Electronics, 4th Year",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "The food quality is excellent and the recreational facilities help maintain a perfect work-life balance. Highly recommended!",
      rating: 5
    }
  ];
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-accent font-bold text-center text-primary-800 dark:text-primary-300 mb-12">What Our Students Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{testimonial.text}"
              </p>
              <div className="mt-4 flex text-yellow-400">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
