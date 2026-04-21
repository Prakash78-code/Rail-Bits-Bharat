import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demokey",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "demosecret12345",
});

export const createRazorpayOrder = async (amount: number) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    return await razorpay.orders.create(options);
  } catch (error) {
    console.error("Razorpay Service Error (Create Order):", error);
    throw error;
  }
};

export const verifyRazorpayPayment = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || "demosecret12345";
  
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  return generated_signature === razorpay_signature;
};
