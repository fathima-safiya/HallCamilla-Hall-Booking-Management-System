import React, { useEffect } from 'react';
import CryptoJS from 'crypto-js';

declare global {
  interface Window {
    payhere: any;
  }
}

interface PayHereButtonProps {
  merchantId: string;
  merchantSecret: string;
  orderId: string;
  amount: number;
  currency: string;
  items: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  onSuccess: (orderId: string) => void;
  onDismissed: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export default function PayHereButton(props: PayHereButtonProps) {
  useEffect(() => {
    // Inject the PayHere script dynamically if not already present
    if (!document.getElementById('payhere-script')) {
      const script = document.createElement('script');
      script.id = 'payhere-script';
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = () => {
    if (!window.payhere) {
      alert('PayHere is loading, please try again in a moment.');
      return;
    }

    const {
      merchantId,
      merchantSecret,
      orderId,
      amount,
      currency,
      items,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country
    } = props;

    // Format amount to 2 decimal places exactly as required by PayHere
    const formattedAmount = Number(amount).toFixed(2);
    
    // --- SECURITY: MD5 HASH GENERATION ---
    // PayHere requires an MD5 hash to securely verify the payment details haven't been tampered with.
    // The hash is built using: MerchantID + OrderID + AmountFormatted + Currency + HashedMerchantSecret
    
    // Step 1: Hash the Merchant Secret
    const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
    
    // Step 2: Format the amount correctly (e.g. 1,000.00 -> 1000.00)
    const amountFormatted = parseFloat(formattedAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');
    
    // Step 3: Combine them all and hash the final string
    const hash = CryptoJS.MD5(merchantId + orderId + amountFormatted + currency + hashedSecret).toString().toUpperCase();

    // Callbacks
    window.payhere.onCompleted = function onCompleted(completedOrderId: string) {
      props.onSuccess(completedOrderId);
    };

    window.payhere.onDismissed = function onDismissed() {
      props.onDismissed();
    };

    window.payhere.onError = function onError(error: string) {
      props.onError(error);
    };

    // Payment Object
    const payment = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: window.location.origin + '/dashboard',
      cancel_url: window.location.origin + window.location.pathname,
      notify_url: window.location.origin, // Not strictly used for frontend validation in Sandbox
      order_id: orderId,
      items: items,
      amount: formattedAmount,
      currency: currency,
      hash: hash,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      country: country
    };

    // Trigger PayHere
    window.payhere.startPayment(payment);
  };

  return (
    <button
      onClick={handlePay}
      disabled={props.isProcessing}
      className="w-full bg-[#1c2331] hover:bg-[#2c374d] text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {props.isProcessing ? (
        <span className="flex items-center gap-2 tracking-widest uppercase text-sm">Processing...</span>
      ) : (
        <span className="flex items-center gap-2 tracking-widest uppercase text-sm">Pay Securely with PayHere</span>
      )}
    </button>
  );
}
