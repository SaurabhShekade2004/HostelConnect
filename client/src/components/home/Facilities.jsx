export default function Facilities() {
  const facilities = [
    {
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Modern Rooms",
      description: "Well-furnished rooms with comfortable beds, study tables, and storage space for all your belongings."
    },
    {
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Recreation Areas",
      description: "Indoor and outdoor recreation facilities including games room, TV lounge, and sports courts."
    },
    {
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Modern Cafeteria",
      description: "Spacious dining area serving nutritious meals with options for special dietary requirements."
    }
  ];
  
  return (
    <section id="facilities" className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-accent font-bold text-center text-primary-800 dark:text-primary-300 mb-4">Our Facilities</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
          We provide modern amenities to ensure a comfortable and productive stay for all our students.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
              <img 
                src={facility.image}
                alt={facility.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{facility.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {facility.description}
                </p>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center">
                  Learn more <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
