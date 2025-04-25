import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-700 dark:text-gray-200">404</h1>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Page Not Found</h2>
      <p className="text-lg mb-8 max-w-md text-gray-600 dark:text-gray-300">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button asChild className="bg-orange-500 hover:bg-orange-600">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}