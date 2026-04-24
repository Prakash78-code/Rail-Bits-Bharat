import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQty, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items from a vendor to get started.</p>
          <button onClick={() => navigate("/passenger")} className="btn-primary">Browse Food</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-lg">
        <h1 className="font-display text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-card rounded-2xl border border-border p-5 mb-4 space-y-3">
          {items.map(ci => (
            <div key={ci.item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="text-xl">{ci.item.isVeg ? "🟢" : "🔴"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{ci.item.name}</div>
                <div className="text-xs text-muted-foreground">₹{ci.item.price} each</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                  <button onClick={() => updateQty(ci.item.id, ci.qty - 1)} className="w-6 h-6 rounded-lg bg-background flex items-center justify-center hover:bg-muted transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{ci.qty}</span>
                  <button onClick={() => updateQty(ci.item.id, ci.qty + 1)} className="w-6 h-6 rounded-lg bg-background flex items-center justify-center hover:bg-muted transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="font-bold text-sm w-14 text-right">₹{ci.item.price * ci.qty}</span>
                <button onClick={() => removeItem(ci.item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Subtotal</span><span>₹{total}</span></div>
          <div className="flex justify-between text-sm mb-3"><span className="text-muted-foreground">GST (5%)</span><span>₹{Math.round(total * 0.05)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
            <span>Total</span><span className="text-accent">₹{total + Math.round(total * 0.05)}</span>
          </div>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary w-full py-4 text-base">
          Proceed to Checkout <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}