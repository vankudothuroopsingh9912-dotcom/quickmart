import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building, Wallet, CheckCircle2, Lock } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number;
  customerName: string;
  customerEmail: string;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  amount,
  customerName,
  customerEmail,
  orderId,
  onSuccess,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [upiId, setUpiId] = useState('quickmart@upi');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedPaymentId = `pay_rzp_test_${Math.floor(100000 + Math.random() * 900000)}`;
      onSuccess(generatedPaymentId);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Razorpay branded look */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
              <span className="font-extrabold text-blue-400 text-lg">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm tracking-wide text-white">Razorpay Checkout</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  TEST MODE
                </span>
              </div>
              <p className="text-xs text-blue-200">Merchant: QuickMart Inc.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-300">Amount Payable</div>
            <div className="text-xl font-extrabold text-white">${amount.toFixed(2)}</div>
          </div>
        </div>

        {/* Security badge bar */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit SSL Secure Test Gateway</span>
          </div>
          <span className="text-slate-400">Order: #{orderId}</span>
        </div>

        {/* Payment tabs */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'card'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Card
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upi'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" /> UPI / QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('netbanking')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'netbanking'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building className="w-4 h-4" /> NetBanking
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6 space-y-4">
          {activeTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="4111 2222 3333 4444"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-700 leading-relaxed">
                Test Visa credentials pre-filled. No real credit card or debit card charge will occur.
              </div>
            </div>
          )}

          {activeTab === 'upi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">UPI ID or VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="username@okhdfcbank"
                />
              </div>

              <div className="flex gap-2">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiId(`${app.toLowerCase().replace(' ', '')}@upi`)}
                    className="flex-1 py-2 text-xs border border-slate-200 rounded-lg hover:border-blue-400 text-slate-700 font-medium"
                  >
                    {app}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs text-slate-500">Fast one-click UPI test verification</span>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-700">Select Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{bank}</span>
                    {selectedBank === bank && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Test Payment...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
