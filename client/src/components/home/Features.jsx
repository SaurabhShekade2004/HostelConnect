export default function Features() {
  const features = [
    {
      icon: "fa-wifi",
      title: "High-Speed WiFi",
      description: "Stay connected with fast and reliable internet access throughout the hostel."
    },
    {
      icon: "fa-utensils",
      title: "Quality Meals",
      description: "Nutritious and delicious meals prepared daily in our modern kitchen facilities."
    },
    {
      icon: "fa-shield-alt",
      title: "24/7 Security",
      description: "Round-the-clock security personnel and CCTV monitoring for your safety."
    },
    {
      icon: "fa-book",
      title: "Study Areas",
      description: "Dedicated quiet zones and study rooms to help you focus on academics."
    }
  ];
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-accent font-bold text-center text-primary-800 dark:text-primary-300 mb-12">Why Choose Our Hostel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md transition-all hover:shadow-lg">
              <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <i className={`fas ${feature.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
