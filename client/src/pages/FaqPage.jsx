import { useState } from 'react';
import { Link } from 'wouter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ data
  const faqItems = [
    {
      id: 'faq-1',
      question: 'What is included in the housing fees?',
      answer: 'Our housing fees include accommodation, utilities (water, electricity, heating), Wi-Fi internet access, basic furniture (bed, desk, chair, wardrobe), maintenance services, and access to common areas and facilities such as study rooms, lounges, and laundry facilities. Some premium accommodations may include additional amenities.'
    },
    {
      id: 'faq-2',
      question: 'How are roommates assigned?',
      answer: 'Roommates are assigned based on several factors including academic year, department/program, preferences indicated in your housing application, and lifestyle compatibility. First-year students are typically assigned roommates randomly with consideration to department matching. Returning students can request specific roommates through our roommate selection process during the housing renewal period.'
    },
    {
      id: 'faq-3',
      question: 'Can I stay during breaks and holidays?',
      answer: 'Most residence halls remain open during short breaks (fall break, Thanksgiving, spring break), but some close completely during winter break (December-January). Students who need housing during closed periods can apply for holiday housing, which may be available in designated buildings for an additional fee. Summer housing is available through a separate application process.'
    },
    {
      id: 'faq-4',
      question: 'What security measures are in place?',
      answer: 'Our residence halls feature 24/7 security with controlled access systems requiring student ID cards, security cameras in common areas and entrances, on-duty residence life staff, emergency phones, and regular security patrols. All buildings have fire safety systems and emergency procedures in place. Security staff can escort students to their residence halls upon request during night hours.'
    },
    {
      id: 'faq-5',
      question: 'Is parking available for residents?',
      answer: 'Limited parking is available for residents with valid parking permits. Permits are issued on a first-come, first-served basis with priority given to upperclassmen and students with special needs. The parking permit fee is separate from housing fees. Bicycle storage is available free of charge in designated areas near each residence hall.'
    },
    {
      id: 'faq-6',
      question: 'What dining options are available?',
      answer: 'Our dining program offers several meal plan options ranging from 7 to 19 meals per week at the main dining hall. Additional dining options include a café, convenience store, and food court in the student center. All meal plans include some amount of flexible dining dollars that can be used at any campus dining location. Vegetarian, vegan, and special dietary needs can be accommodated.'
    },
    {
      id: 'faq-7',
      question: 'How do I apply for housing?',
      answer: 'Housing applications open in February for the following academic year. To apply, log in to the student portal, complete the housing application form, pay the housing application fee, and select your preferred housing options. First-year students will receive housing assignments in July. Returning students participate in a room selection process in March-April.'
    },
    {
      id: 'faq-8',
      question: 'What should I bring to my residence hall?',
      answer: 'Essentials to bring include bedding (twin XL sheets, pillows, blankets), toiletries, towels, laundry supplies, personal electronics, and study supplies. Recommended items include a desk lamp, shower caddy, power strips, and personal décor. Prohibited items include candles, halogen lamps, hot plates, space heaters, and pets (except fish in tanks under 10 gallons).'
    },
    {
      id: 'faq-9',
      question: 'Is there internet access in the residence halls?',
      answer: 'Yes, all residence halls are equipped with high-speed Wi-Fi throughout the buildings. Additionally, each room has Ethernet ports for wired connections. The campus network provides access to online academic resources, including the library database, student portal, and learning management system. Technical support is available through the campus IT help desk.'
    },
    {
      id: 'faq-10',
      question: 'Can I have overnight guests?',
      answer: 'Residents may have overnight guests with proper registration through the residence hall front desk. Guests must be registered at least 24 hours in advance and can stay for up to three consecutive nights, with a maximum of nine nights per semester. Roommate consent is required for all overnight guests. All guests must carry a guest pass and follow residence hall policies.'
    }
  ];

  // Filter FAQ items based on search query
  const filteredFaqs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Find answers to common questions about our residence halls.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium hover:text-orange-500 dark:text-white">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">No questions found matching your search.</p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery('')}
                  className="text-orange-500"
                >
                  Clear search
                </Button>
              </div>
            )}

            {/* Contact Prompt */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Don't see your question here?
              </p>
              <Link href="/contact">
                <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
                  Contact our housing office →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}