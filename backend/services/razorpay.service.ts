import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("❌ Razorpay ENV variables missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 Create Order
export const createRazorpayOrder = async (amount: number) => {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return order;
  } catch (error) {
    console.error("🔥 Razorpay Error:", error);
    throw new Error("Failed to create Razorpay order");
  }
};

// 🟢 Verify Payment
export const verifyRazorpayPayment = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) throw new Error("Razorpay secret missing");

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return generated_signature === razorpay_signature;
};