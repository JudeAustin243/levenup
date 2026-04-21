"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionWithCategoriesProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
    category?: string;
  }[];
}

const FaqSectionWithCategories = React.forwardRef<HTMLElement, FaqSectionWithCategoriesProps>(
  ({ className, title, description, items, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-28 w-full", className)}
        {...props}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Left column: Title + contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                {title}
              </h2>
              {description && (
                <p className="text-gray-500 text-xl mt-4">
                  {description}
                </p>
              )}
              <div className="mt-8">
                <p className="text-base text-gray-500">Still have questions?</p>
                <a
                  href="mailto:support@levenup.com"
                  className="text-indigo-600 text-base font-medium hover:underline mt-1 inline-block"
                >
                  Get in touch &rarr;
                </a>
              </div>
            </motion.div>

            {/* Right column: Accordion */}
            <div className="lg:col-span-3">
              <Accordion type="single" collapsible className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className={cn(
                        "rounded-2xl",
                        "bg-white",
                        "border border-gray-200",
                        "shadow-sm"
                      )}
                    >
                      <AccordionTrigger
                        className={cn(
                          "px-7 py-5 text-left hover:no-underline",
                          "data-[state=open]:border-b data-[state=open]:border-gray-200"
                        )}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent className="px-7 pt-4 pb-6">
                        <p className="text-gray-500 text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
FaqSectionWithCategories.displayName = "FaqSectionWithCategories";

export { FaqSectionWithCategories };
