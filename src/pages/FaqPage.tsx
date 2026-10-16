import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast does QuickMart ship orders?',
      a: 'We ship most standard orders within 24 hours. Standard delivery typically takes 3 to 5 business days, while Priority Express arrives in 1 to 2 business days. Real-time GPS waybill tracking is available via our Track Order page immediately upon carrier dispatch.'
    },
    {
      q: 'How does the Free Shipping promotion work?',
      a: 'All orders with a subtotal of $75 or more automatically qualify for 100% Free Standard Shipping. You can also apply coupon code FREESHIP on qualifying carts over $50.'
    },
    {
      q: 'What is your return and refund policy?',
      a: 'We offer an unconditional 30-day money-back guarantee. If you are not completely satisfied with your purchase, simply open your Order Tracking page and click "Request Return". We will provide a prepaid postage label, and your refund will be credited back to your original payment method within 3 business days of receiving the package.'
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept Razorpay online payments (supporting Visa, Mastercard, American Express, NetBanking, and UPI such as Google Pay and PhonePe) as well as Cash on Delivery (COD) in supported regions.'
    },
    {
      q: 'Are all products authentic and covered by warranty?',
      a: 'Yes, 100%. QuickMart sources products directly from licensed brand manufacturers and authorized distributors. Every eligible item includes the standard manufacturer warranty and our QuickMart genuine seal.'
    },
    {
      q: 'Can I cancel an order after placing it?',
      a: 'Yes. Eligible orders in "Order Placed", "Confirmed", or "Processing" states can be cancelled directly with one click from the Order Tracking page, and any charges will be automatically refunded.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" /> Help & Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Find fast answers regarding shipping times, payment methods, order tracking, and returns.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                  openIndex === idx ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>

            {openIndex === idx && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still need help banner */}
      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-sm text-blue-900">Still have a question?</h4>
          <p className="text-xs text-blue-700 mt-0.5">Our customer assistance team is here 24 hours a day to assist you.</p>
        </div>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shrink-0"
        >
          Contact Customer Care <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
