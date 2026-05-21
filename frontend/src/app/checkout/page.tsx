'use client';

import React, { useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../../utils/api';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, MapPin, Building, ArrowRight, 
  FileText, CheckCircle2, Loader2, Download, Mail, AlertTriangle, RefreshCw, XCircle
} from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    min_order_quantity: number;
  };
}

interface ApiCartItem {
  id: string;
  quantity: number;
  product: {
    id: number;
    price?: number | string;
    price_min?: number | string;
    name?: string;
    min_order_quantity?: number | string;
  };
}

interface SimulatedOrderDetails {
  order_id?: number;
  razorpay_order_id?: string;
  amount?: number;
}

interface CompletedOrder {
  id: number;
  order_number?: string;
  grand_total?: number;
}

interface CompletedInvoice {
  invoice_number?: string;
  gstin?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('Dock 4, Hub B, Tata Sourcing Hub, Navi Mumbai, Maharashtra, 400708');
  const [gstin, setGstin] = useState('27AAPCT4391M1Z5'); // Mock corporate GSTIN
  
  // Checkout process states
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  
  // Simulated Payment Modal (if Razorpay key is mock)
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedOrderDetails, setSimulatedOrderDetails] = useState<SimulatedOrderDetails | null>(null);
  
  // Post-payment success states
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<CompletedInvoice | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [emailingInvoice, setEmailingInvoice] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // High-fidelity payment simulation states
  const [paymentVerificationState, setPaymentVerificationState] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'failed'>('idle');
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'netbanking' | 'fail_simulation'>('card');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [upiId, setUpiId] = useState('buyer@tataupi');
  const [failureReason, setFailureReason] = useState('Insufficient Corporate Credit Limit');

  // Fetch cart on mount
  const fetchCartDetails = async () => {
    try {
      const response = await api.get('/cart');
      const items: ApiCartItem[] = response.data.data.cart?.items || [];
      setCartItems(items.map((item: ApiCartItem) => ({
        id: String(item.id),
        quantity: Number(item.quantity),
        product: {
          id: Number(item.product.id),
          name: String(item.product.name || 'Product'),
          price: Number(item.product.price || item.product.price_min || 0),
          min_order_quantity: Number(item.product.min_order_quantity || 1)
        }
      })));
      if (items.length === 0) {
        if (!paymentSuccess) {
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Failed to load corporate cart for checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchCartDetails();
  }, [isAuthenticated]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cgst = parseFloat((subtotal * 0.09).toFixed(2));
  const sgst = parseFloat((subtotal * 0.09).toFixed(2));
  const shippingFee = subtotal > 0 ? 500.00 : 0.00;
  const grandTotal = subtotal + cgst + sgst + shippingFee;

  // Execute Order Placement and Payment Creation
  const handleInitiatePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!shippingAddress.trim()) {
      setCheckoutError('Please provide a corporate destination address.');
      return;
    }

    setCheckingOut(true);
    setCheckoutError('');
    setPaymentVerificationState('processing');

    try {
      // 1. Create order record on the backend
      const orderResponse = await api.post('/orders', {
        shippingAdd: shippingAddress
      });
      const orderData = orderResponse.data.data;

      // 2. Create Razorpay Payment Gateway order
      const paymentResponse = await api.post('/payments/create-order', {
        order_id: orderData.id
      });
      setSimulatedOrderDetails(paymentResponse.data.data);
    } catch (error) {
      setCheckoutError(getApiErrorMessage(error, 'Initiating payment failed. Please try again.'));
      setPaymentVerificationState('failed');
      setPaymentErrorMessage(getApiErrorMessage(error, 'Order creation failed.'));
    } finally {
      setCheckingOut(false);
    }
  };

  // Complete Payment Verification
  const handleVerifyPayment = async (orderId: number, rzpOrderId: string, rzpPaymentId: string, rzpSignature?: string) => {
    setPaymentVerificationState('verifying');
    setCheckoutError('');
    try {
      const response = await api.post('/payments/verify-signature', {
        order_id: orderId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: rzpPaymentId,
        razorpay_signature: rzpSignature,
        gstin: gstin
      });

      const data = response.data.data;
      setCompletedOrder(data.order);
      setCompletedInvoice(data.invoice);
      setPaymentSuccess(true);
      setPaymentVerificationState('success');
      setShowSimulatedModal(false);
    } catch (error) {
      setPaymentVerificationState('failed');
      setPaymentErrorMessage(getApiErrorMessage(error, 'Verification failed. Payment capture failed.'));
      setShowSimulatedModal(false);
    }
  };

  // Complete Payment Failure Simulation
  const handleFailPayment = async (orderId: number, reason: string) => {
    setPaymentVerificationState('verifying');
    setCheckoutError('');
    try {
      await api.post('/payments/fail-order', {
        order_id: orderId,
        reason: reason
      });
      setPaymentVerificationState('failed');
      setPaymentErrorMessage(reason);
      setShowSimulatedModal(false);
    } catch (error) {
      setPaymentVerificationState('failed');
      setPaymentErrorMessage(getApiErrorMessage(error, 'Payment decline processing failed.'));
      setShowSimulatedModal(false);
    }
  };

  // Print/Download Invoice File Stream
  const handleDownloadInvoice = async () => {
    if (!completedOrder) return;
    setDownloadingInvoice(true);
    try {
      const response = await api.get(`/orders/${completedOrder.id}/invoice/download`, {
        responseType: 'blob'
      });
      
      const file = new Blob([response.data], { type: 'text/plain' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      const invoiceNumber = completedInvoice?.invoice_number ?? String(completedOrder.id ?? 'invoice');
      link.setAttribute('download', `TAX_INVOICE_${invoiceNumber}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Invoice download failed:', error);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Dispatch email copy of the B2B Tax invoice
  const handleEmailInvoice = async () => {
    if (!completedOrder) return;
    setEmailingInvoice(true);
    setEmailSuccess(false);
    try {
      await api.post(`/orders/${completedOrder.id}/invoice/email`);
      setEmailSuccess(true);
    } catch (error) {
      console.error('Invoice emailing failed:', error);
    } finally {
      setEmailingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] pt-32 flex items-center justify-center">
        <div className="h-8 w-8 border border-ink-black border-t-transparent dark:border-white animate-spin"></div>
      </div>
    );
  }

  if (paymentVerificationState === 'verifying') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 transition-colors duration-300">
        <main className="mx-auto max-w-xl px-6 py-24 text-center relative flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center max-w-sm border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-10 rounded-none shadow-sm"
          >
            <div className="h-12 w-12 border border-secondary text-secondary rounded-none flex items-center justify-center mb-6">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <h2 className="font-heading text-2xl font-light text-ink-black dark:text-white mb-3">Verifying Transaction</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              We are connecting with the issuer bank gateway to confirm your payment signature. Please do not close or refresh this page.
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  if (paymentVerificationState === 'failed') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 transition-colors duration-300">
        <main className="mx-auto max-w-xl px-6 py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative rounded-none bg-white p-8 sm:p-10 border border-border-subtle dark:bg-[#151515] dark:border-zinc-800 shadow-sm"
          >
            <div className="mx-auto h-12 w-12 border border-red-500 text-red-500 rounded-none flex items-center justify-center mb-6">
              <XCircle className="h-6 w-6" />
            </div>

            <h1 className="font-heading text-3xl font-light text-ink-black dark:text-white mb-3">Payment Declined</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed mb-6">
              Your simulated B2B checkout transaction was declined or interrupted by the issuer system.
            </p>

            <div className="border border-border-subtle dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-5 mb-8 text-left text-xs space-y-3 font-monoenterprise text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>DECLINE REASON</span>
                <span className="text-red-650 dark:text-red-455 font-bold">{paymentErrorMessage || 'Transaction aborted.'}</span>
              </div>
              <div className="flex justify-between">
                <span>ORDER TARGET ID</span>
                <span className="text-zinc-950 dark:text-white font-bold">
                  #{simulatedOrderDetails?.order_id || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setPaymentVerificationState('idle');
                  setPaymentErrorMessage('');
                  setShowSimulatedModal(true);
                }}
                className="flex items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-850 text-white font-monoenterprise uppercase tracking-widest py-4 text-xs transition-all active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Payment</span>
              </button>
              <Link
                href="/cart"
                className="flex items-center justify-center rounded-none border border-border-subtle hover:bg-zinc-50 text-ink-black dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900 font-monoenterprise uppercase tracking-widest py-3.5 text-xs transition-all"
              >
                Return to Cart
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 transition-colors duration-300">
        <main className="mx-auto max-w-xl px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative rounded-none bg-white p-8 sm:p-10 border border-border-subtle dark:bg-[#151515] dark:border-zinc-800 shadow-sm"
          >
            <div className="mx-auto h-12 w-12 border border-secondary text-secondary rounded-none flex items-center justify-center mb-6">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h1 className="font-heading text-3xl font-light text-ink-black dark:text-white mb-3">Payment Successful</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed mb-6">
              Your wholesale transaction has been finalized and recorded in the TATAmart order tracking ledger database.
            </p>

            {/* Structured Invoice Summary Details */}
            <div className="border border-border-subtle dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-5 mb-8 text-left text-xs space-y-3 font-monoenterprise text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>INVOICE NUMBER</span>
                <span className="text-zinc-950 dark:text-white font-bold">{completedInvoice?.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>COMPANY GSTIN</span>
                <span className="text-zinc-950 dark:text-white font-bold">{completedInvoice?.gstin}</span>
              </div>
              <div className="flex justify-between">
                <span>ORDER NUMBER</span>
                <span className="text-zinc-950 dark:text-white font-bold">{completedOrder?.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL PRICE</span>
                <span className="text-secondary dark:text-emerald-400 font-bold" suppressHydrationWarning>
                  ₹{Number(completedOrder?.grand_total ?? grandTotal).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Operational Invoice Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="flex items-center justify-center gap-2 rounded-none border border-border-subtle dark:border-zinc-800 hover:bg-zinc-50 py-3.5 text-xs font-monoenterprise uppercase tracking-widest text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                {downloadingInvoice ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Invoice</span>
                  </>
                )}
              </button>

              <button
                onClick={handleEmailInvoice}
                disabled={emailingInvoice || emailSuccess}
                className="flex items-center justify-center gap-2 rounded-none border border-border-subtle dark:border-zinc-800 hover:bg-zinc-50 py-3.5 text-xs font-monoenterprise uppercase tracking-widest text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50"
              >
                {emailingInvoice ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : emailSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span className="text-secondary">Emailed!</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Email Invoice</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-850 text-white font-monoenterprise uppercase tracking-widest py-4 text-xs transition-all active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
              >
                <span>Products Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/buyer"
                className="flex items-center justify-center rounded-none border border-border-subtle hover:bg-zinc-50 text-ink-black dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900 font-monoenterprise uppercase tracking-widest py-3.5 text-xs transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#111111] text-ink-black dark:text-zinc-50 pt-24 selection:bg-[#043F1C] selection:text-white transition-colors duration-300">

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-16">
        <div className="mb-12 border-b border-border-subtle dark:border-zinc-800 pb-8">
          <span className="font-monoenterprise text-[10px] tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2 mb-3">
            <Building className="h-3.5 w-3.5 text-secondary" />
            <span>Secure Enterprise Checkout</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-tight text-ink-black dark:text-white">
            Payment <span className="italic">Manifest</span>
          </h1>
        </div>

        {checkoutError && (
          <div className="max-w-4xl mx-auto mb-8 p-4 text-xs font-monoenterprise uppercase tracking-widest text-red-650 border border-red-200/50 bg-red-50/50 dark:border-red-955/35">
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          {/* Sourcing Destination & GST Registry */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-7 rounded-none">
              <h3 className="font-heading text-xl font-normal text-zinc-900 dark:text-white mb-6 flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-secondary" />
                <span>Logistics Destination Address</span>
              </h3>

              <textarea
                required
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="e.g. Dock 4, Hub B, Tata Sourcing Hub, Navi Mumbai, Maharashtra, 400708"
                className="w-full rounded-none border border-border-subtle bg-white py-3.5 px-4 text-xs font-sans text-zinc-950 placeholder-zinc-400 outline-none transition-colors focus:border-ink-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-650"
              />
            </div>

            <div className="border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-7 rounded-none">
              <h3 className="font-heading text-xl font-normal text-zinc-900 dark:text-white mb-6 flex items-center gap-2.5">
                <Building className="h-4.5 w-4.5 text-secondary" />
                <span>Corporate GST Tax Registry</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 dark:text-zinc-550 mb-2 ml-0.5">
                    GSTIN Identity Code
                  </label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="27AAPCT4391M1Z5"
                    className="w-full rounded-none border border-border-subtle bg-white py-3 px-4 text-xs font-monoenterprise text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center text-[10px] font-sans text-zinc-450 dark:text-zinc-500 leading-relaxed">
                  Providing a valid corporate GSTIN is mandatory to secure tax invoice inputs (9% CGST + 9% SGST) for corporate accounting.
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Checkout Summary & Payment Action */}
          <div className="space-y-6">
            <div className="sticky top-24 border border-border-subtle dark:border-zinc-800 bg-white dark:bg-[#151515] p-7 rounded-none">
              <div className="flex items-center space-x-2 font-monoenterprise uppercase tracking-[0.2em] text-[10px] text-zinc-450 dark:text-zinc-550 mb-6 pb-5 border-b border-border-subtle dark:border-zinc-800">
                <FileText className="h-4 w-4 text-secondary" />
                <span>GST Tax Invoice Summary</span>
              </div>

              <div className="space-y-4 font-monoenterprise">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Gross Assembly Cost</span>
                  <span className="text-zinc-950 dark:text-white font-semibold" suppressHydrationWarning>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>CGST (9%)</span>
                  <span className="text-zinc-950 dark:text-white font-semibold" suppressHydrationWarning>₹{cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>SGST (9%)</span>
                  <span className="text-zinc-950 dark:text-white font-semibold" suppressHydrationWarning>₹{sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Freight logistics</span>
                  <span className="text-zinc-950 dark:text-white font-semibold" suppressHydrationWarning>₹{shippingFee.toLocaleString()}</span>
                </div>

                <div className="pt-5 mt-1 border-t border-border-subtle dark:border-zinc-800 flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-550">Master Total</span>
                  <span className="text-xl font-semibold text-secondary dark:text-emerald-400 flex items-baseline leading-none" suppressHydrationWarning>
                    <span className="text-xs mr-0.5">₹</span>
                    {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleInitiatePayment}
                disabled={checkingOut || cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-none bg-ink-black hover:bg-zinc-850 py-4 text-xs font-monoenterprise uppercase tracking-widest text-white transition-all disabled:opacity-50 mt-8 active:scale-[0.99] dark:bg-white dark:hover:bg-zinc-200 dark:text-ink-black"
              >
                {checkingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Pay with Razorpay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* High-Fidelity Simulated Sandbox Payment Modal */}
      <AnimatePresence>
        {showSimulatedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg border border-border-subtle bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#151515] rounded-none overflow-hidden"
            >
              {/* Razorpay Gateway Header */}
              <div className="bg-ink-black text-white px-6 py-5 flex justify-between items-center border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 border border-white flex items-center justify-center text-white font-mono enterprise text-[11px] font-bold tracking-widest">
                    TM
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-normal tracking-tight">TATAmart B2B Marketplace</h4>
                    <span className="text-[9px] text-zinc-400 font-monoenterprise uppercase tracking-widest">Razorpay Sandbox (Test Mode)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-450 uppercase font-monoenterprise block tracking-widest">Amount to Pay</span>
                  <span className="font-monoenterprise text-sm font-semibold text-emerald-450" suppressHydrationWarning>
                    ₹{Number(simulatedOrderDetails?.amount ?? grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Method selector tabs */}
                <div className="grid grid-cols-4 gap-2 mb-6 border-b border-border-subtle dark:border-zinc-800 pb-4">
                  {(() => {
                    const paymentTabs = [
                      { id: 'card', label: 'Card' },
                      { id: 'upi', label: 'UPI' },
                      { id: 'netbanking', label: 'Netbank' },
                      { id: 'fail_simulation', label: 'Decline' }
                    ] as const;
                    return paymentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedMethod(tab.id)}
                      className={`py-2 px-1 text-[9px] font-monoenterprise uppercase tracking-widest transition-colors border rounded-none ${
                        selectedMethod === tab.id
                          ? 'border-ink-black bg-ink-black text-white dark:border-white dark:bg-white dark:text-ink-black'
                          : 'border-border-subtle bg-transparent text-zinc-450 hover:text-zinc-800 dark:border-zinc-800 dark:hover:text-zinc-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  )); })()}
                </div>

                {/* Card payment content */}
                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 mb-1.5">Corporate Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 1111 1111 1111"
                        className="w-full rounded-none border border-border-subtle bg-white py-2.5 px-3 text-xs font-monoenterprise text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 mb-1.5">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full rounded-none border border-border-subtle bg-white py-2.5 px-3 text-xs font-monoenterprise text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 mb-1.5">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full rounded-none border border-border-subtle bg-white py-2.5 px-3 text-xs font-monoenterprise text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI content */}
                {selectedMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 mb-1.5">Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="buyer@tataupi"
                        className="w-full rounded-none border border-border-subtle bg-white py-2.5 px-3 text-xs font-monoenterprise text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                      />
                    </div>
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-sans leading-relaxed">
                      A simulated transaction request will be sent to this VPA ledger interface.
                    </span>
                  </div>
                )}

                {/* NetBanking content */}
                {selectedMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 mb-1.5">Select Bank Node</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full rounded-none border border-border-subtle bg-white py-2.5 px-3 text-xs font-monoenterprise text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white cursor-pointer"
                      >
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Tata Sourcing Bank">Tata Corporate Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Failure simulation content */}
                {selectedMethod === 'fail_simulation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-monoenterprise uppercase tracking-[0.2em] text-zinc-450 mb-1.5">Simulated Decline Reason</label>
                      <select
                        value={failureReason}
                        onChange={(e) => setFailureReason(e.target.value)}
                        className="w-full rounded-none border border-border-subtle bg-white py-2.5 px-3 text-xs font-monoenterprise text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white cursor-pointer"
                      >
                        <option value="Insufficient Corporate Credit Limit">Insufficient Corporate Credit Limit</option>
                        <option value="Issuer Bank Network Timeout">Issuer Bank Network Timeout</option>
                        <option value="Incorrect Corporate CVV Code">Incorrect Corporate CVV Code</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  {selectedMethod !== 'fail_simulation' ? (
                    <button
                      onClick={() => handleVerifyPayment(
                        simulatedOrderDetails?.order_id ?? 0,
                        simulatedOrderDetails?.razorpay_order_id ?? '',
                        'pay_mock_' + Math.random().toString(36).substring(2, 11)
                      )}
                      className="w-full flex items-center justify-center gap-2 rounded-none bg-secondary hover:bg-secondary/90 py-3.5 text-xs font-monoenterprise uppercase tracking-widest text-white active:scale-[0.99] transition-all"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span suppressHydrationWarning>Pay ₹{Number(simulatedOrderDetails?.amount ?? grandTotal).toLocaleString()}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFailPayment(simulatedOrderDetails?.order_id ?? 0, failureReason)}
                      className="w-full flex items-center justify-center gap-2 rounded-none bg-red-650 hover:bg-red-700 py-3.5 text-xs font-monoenterprise uppercase tracking-widest text-white active:scale-[0.99] transition-all"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Simulate Decline Transaction</span>
                    </button>
                  )}

                  <button
                      onClick={() => {
                        handleFailPayment(simulatedOrderDetails?.order_id ?? 0, 'Transaction canceled by client user.');
                      }}
                    className="w-full text-center text-[10px] font-monoenterprise uppercase tracking-widest text-zinc-400 hover:text-zinc-500 mt-2 block"
                  >
                    Cancel Transaction
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
