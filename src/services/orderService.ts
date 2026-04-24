import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// 📍 REAL TIME LOCATION UPDATE
export const updatePartnerLocation = async (
  orderId: string,
  lat: number,
  lng: number
) => {
  await updateDoc(doc(db, "orders", orderId), {
    "location.lat": lat,
    "location.lng": lng,
    updatedAt: Date.now(),
  });
};