import React, { useState } from 'react';
import { Shield, FileText, RotateCcw } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'returns'>('privacy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Policies & Legal Information</h1>
        <p className="text-xs text-slate-500">Transparent guidelines governing your shopping rights at QuickMart.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'privacy'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" /> Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'terms'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Terms of Service
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'returns'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Return & Refund Policy
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed shadow-xs">
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Privacy Policy (Effective 2026)</h2>
            <p>
              At QuickMart, your privacy is paramount. We only collect the minimal personal information required to process and ship your orders, provide real-time package updates, and improve your browsing convenience.
            </p>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">1. Data We Collect</h3>
            <p>
              When you create an account or place an order, we collect your name, shipping address, email, phone number, and transaction identifiers. We never store raw credit card numbers; all payments are processed through PCI-DSS Level 1 compliant gateways (Razorpay).
            </p>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">2. How We Use Your Data</h3>
            <p>
              Your data is utilized solely for order fulfillment, fraud prevention, and dispatching order confirmations. We do not sell or rent user details to third-party advertisers.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Terms & Conditions</h2>
            <p>
              By accessing and shopping on QuickMart, you agree to comply with the terms and conditions outlined herein.
            </p>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">1. Pricing and Product Accuracy</h3>
            <p>
              We strive to display accurate pricing, descriptions, and stock quantities. In the rare event of a typographical pricing error or inventory discrepancy, QuickMart reserves the right to notify the customer and cancel or adjust the order before dispatch.
            </p>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">2. Account Responsibility</h3>
            <p>
              Users are responsible for maintaining the confidentiality of their credentials and passwords. Please report any unauthorized account access immediately to support@quickmart.com.
            </p>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">30-Day Return & Refund Policy</h2>
            <p>
              We stand behind the craftsmanship of every product. If you're not delighted with your purchase, you can return it within 30 days of delivery.
            </p>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">1. Eligibility</h3>
            <p>
              Items must be in original condition with tags intact and in original packaging. Certain perishable items in grocery or opened beauty serums may be exempt for hygienic reasons.
            </p>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">2. Refund Processing</h3>
            <p>
              Once your return package is scanned by our carrier, your refund is approved and processed to your original payment method within 3 business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
