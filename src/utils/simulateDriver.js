import { updatePartnerLocation } from "@/services/orderService";

export const simulateDriver = (orderId) => {
  let lat = 26.8467;
  let lng = 80.9462;

  setInterval(async () => {
    lat += (Math.random() - 0.5) * 0.001;
    lng += (Math.random() - 0.5) * 0.001;

    await updatePartnerLocation(orderId, lat, lng);
  }, 3000);
};