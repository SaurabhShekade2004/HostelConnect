import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Gallery data
  const galleryItems = [
    {
      id: 1,
      category: 'rooms',
      title: 'Single Room',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
      description: 'Modern single room with study desk and storage space'
    },
    {
      id: 2,
      category: 'rooms',
      title: 'Double Room',
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=1000',
      description: 'Comfortable double room with separate study areas'
    },
    {
      id: 3,
      category: 'rooms',
      title: 'Triple Room',
      image: 'https://images.unsplash.com/photo-1580255692019-74ffdf314e2c?auto=format&fit=crop&q=80&w=1000',
      description: 'Spacious triple room with individual study spaces'
    },
    {
      id: 4,
      category: 'facilities',
      title: 'Study Area',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1000',
      description: 'Quiet study area with natural lighting'
    },
    {
      id: 5,
      category: 'facilities',
      title: 'Computer Lab',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
      description: '24-hour computer lab with printing facilities'
    },
    {
      id: 6,
      category: 'facilities',
      title: 'Dining Hall',
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000',
      description: 'Modern dining hall with varied meal options'
    },
    {
      id: 7,
      category: 'common',
      title: 'Lounge Area',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
      description: 'Comfortable lounge for relaxation and socializing'
    },
    {
      id: 8,
      category: 'common',
      title: 'Game Room',
      image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=1000',
      description: 'Recreation room with various games and entertainment'
    },
    {
      id: 9,
      category: 'outdoors',
      title: 'Hostel Building',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1000',
      description: 'Exterior view of the main hostel building'
    },
    {
      id: 10,
      category: 'facilities',
      title: 'Fitness Center',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=1000',
      description: 'Well-equipped fitness center for residents'
    },
    {
      id: 11,
      category: 'outdoors',
      title: 'Outdoor Seating',
      image: 'https://images.unsplash.com/photo-1602800458591-eddda28a498b?auto=format&fit=crop&q=80&w=1000',
      description: 'Garden seating area for relaxation'
    },
    {
      id: 12,
      category: 'common',
      title: 'Meeting Room',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1000',
      description: 'Meeting room for group discussions and events'
    }
  ];

  // Handle image click
  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Filter gallery items based on search query
  const filteredGallery = galleryItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories for tab navigation
  const categories = ['all', ...new Set(galleryItems.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter by category
  const categoryFilteredGallery = activeCategory === 'all' 
    ? filteredGallery 
    : filteredGallery.filter(item => item.category === activeCategory);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Photo Gallery</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Take a visual tour of our residence halls and facilities.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search gallery..."
                  className="pl-10 w-full md:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {categoryFilteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryFilteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openImageModal(item)}
                >
                  <div className="relative h-60">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">No images found matching your search.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-orange-500 mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10"
              onClick={closeImageModal}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={selectedImage?.image}
              alt={selectedImage?.title}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
              <h3 className="text-xl font-semibold">{selectedImage?.title}</h3>
              <p>{selectedImage?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}