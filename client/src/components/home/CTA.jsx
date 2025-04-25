import { Button } from '@/components/ui/button';

export default function CTA({ onOpenLoginModal }) {
  return (
    <section className="py-16 bg-primary-800 dark:bg-primary-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-accent font-bold text-white mb-4">Ready to Join Our Hostel Community?</h2>
        <p className="text-primary-100 max-w-3xl mx-auto mb-8">
          Experience the perfect blend of comfort, community, and academic excellence. Apply now to secure your spot!
        </p>
        <Button 
          onClick={onOpenLoginModal}
          className="bg-accent hover:bg-accent-600 text-white font-medium py-3 px-8 rounded-md"
        >
          Book Now
        </Button>
      </div>
    </section>
  );
}
