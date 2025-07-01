"use client";
import React, { useEffect, useState } from "react";
import { paymentStatus, startPayment } from "@/helpers/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface OrderDetails {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  order_id: string;
}

interface PaymentData {
  id: string;
  amount: number;
  error?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
}

export default function RazorpayPayment() {
  const [orderDetails] = useState<OrderDetails | null>(null);
  const [payment_data, setPaymentData] = useState<PaymentData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userData = useAuth();

  console.log(userData);

  const { contractId, stage } = useParams();

  const createOrder = async () => {
    setLoading(true);

    try {
      const payment_data = await startPayment(
        contractId as string,
        stage as string
      );
      if (payment_data.error) {
        setError(payment_data.error);
        return;
      }
      setPaymentData(payment_data);
      console.log(payment_data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId && stage) {
      createOrder();
    } else {
      setError("Invalid Order ID or Stage");
    }
  }, [contractId, stage, createOrder]);

  const initiateRazorpayPayment = () => {
    const options = {
      key: "rzp_test_bdRFFqjz7HZIFq", // Replace with your Razorpay Key ID
      name: "Fasal Mitra",
      description: "Test Transaction",
      order_id: payment_data?.id,
      handler: async (response: RazorpayResponse) => {
        try {
          console.log(response);
          const verificationResult = await paymentStatus(
            response.razorpay_order_id
          );
          if (verificationResult.status === "captured") {
            toast.success("Payment Done Successfully");
            setError(null);
          } else {
            toast.error("Payment Failed");
            setError("Payment Failed");
          }
        } catch (e) {
          console.log(e);
          alert("Error verifying payment");
        }
      },
      prefill: {
        name: `${userData.user?.first_name} ${userData.user?.last_name}`,
        email: userData.user?.email,
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <main className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Razorpay Payment</h1>

        <p className="text-gray-600">
          Pay securely using Razorpay. Your payment details are safe and secure.
        </p>

        <p className="text-gray-600 my-2">
          Contract ID: {contractId} | Stage: {stage}
        </p>

        <button
          onClick={initiateRazorpayPayment}
          disabled={loading || !payment_data}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading
            ? "Creating Order..."
            : `Pay ₹${payment_data?.amount ? payment_data.amount / 100 : ""}`}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {orderDetails && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Order Created: {orderDetails.order_id}</p>
            <p>Amount: ₹{payment_data && payment_data.amount / 100}</p>
          </div>
        )}
      </main>
    </div>
  );
}
