import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      question: "What are the hostel timings and curfew rules?",
      answer: "The hostel gates close at 10:00 PM on weekdays and 11:00 PM on weekends. Students arriving late need to get prior permission from the warden. Special arrangements are made during examination periods."
    },
    {
      question: "How is the room allocation process conducted?",
      answer: "Room allocation is primarily based on CGPA rankings. Students with higher academic performance get priority in room selection. Additionally, factors such as seniority and specific requirements are also considered."
    },
    {
      question: "What items should I bring when moving into the hostel?",
      answer: "You should bring personal items like bedding (sheets, pillows), toiletries, study materials, clothing, and personal electronics. The hostel provides basic furniture including a bed, desk, chair, and wardrobe. A detailed checklist is provided after room allocation."
    },
    {
      question: "Are visitors allowed in the hostel?",
      answer: "Visitors are allowed in common areas during designated visiting hours (10:00 AM to 6:00 PM). Family members can visit rooms with prior permission from the warden. All visitors must register at the reception desk."
    }
  ];
  
  return (
    <section id="faq" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-accent font-bold text-center text-primary-800 dark:text-primary-300 mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
          Find answers to common questions about our hostel facilities and application process.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium py-4 px-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
