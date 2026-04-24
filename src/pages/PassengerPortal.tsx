import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { useCartStore } from "@/store/cartStore";
import { STATION_LIST, MOCK_PNRS, type Vendor } from "@/data/mockData";
import { 
  Search, Train, MapPin, Star, Clock, Plus, Minus, ChevronRight, 
  CheckCircle2, ArrowRight, User, Mail, Smartphone, Lock, X
} from "lucide-react";

export default function PassengerPortal() {
  const { state } = useApp();
  const { items, addItem, updateQty, clearCart, setStation, vendorId: cartVendorId } = useCartStore();
  const navigate = useNavigate();

  // Journey State
  const [pnr, setPnr] = useState("");
  const [pnrData, setPnrData] = useState<typeof MOCK_PNRS[string] | null>(null);
  const [pnrError, setPnrError] = useState("");
  
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  
  // Login Drawer State
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<"email" | "phone" | "pin">("email");

  const selectedVendor = state.vendors.find(v => v.id === selectedVendorId);
  const cartTotal = items.reduce((s, i) => s + i.item.price * i.qty, 0);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const stationVendors = state.vendors.filter(v => {
    const station = STATION_LIST.find(s => s.name === selectedStation);
    return station && v.stationCode === station.code && v.approved;
  });

  function handlePnrSearch() {
    setPnrError("");
    if (pnr.length < 10) { setPnrError("PNR must be 10 digits."); return; }
    const data = MOCK_PNRS[pnr] ?? {
      trainName: "AI Express", trainNumber: "12000", coach: "S1", seat: "24",
      stations: ["Lucknow", "Kanpur Central", "Prayagraj Junction"],
    };
    setPnrData(data);
    setSelectedStation("");
    setSelectedVendorId("");
  }

  function handleSelectStation(s: string) {
    setSelectedStation(s);
    setStation(s);
    setSelectedVendorId("");
    // Scroll to vendors smoothly
    setTimeout(() => document.getElementById("vendors-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function handleSelectVendor(v: Vendor) {
    if (cartVendorId && cartVendorId !== v.id && items.length > 0) {
      if (!confirm("Switching vendor will clear your cart. Continue?")) return;
      clearCart();
    }
    setSelectedVendorId(v.id);
    setTimeout(() => document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  return (
    <div className="min-h-screen bg-[#fafafb] dark:bg-[#0a0a0c] font-sans relative overflow-x-hidden selection:bg-orange-500/30 text-slate-900 dark:text-slate-100">
      
      {/* Background Subtle Route Line Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5 z-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[120vh] stroke-orange-500/30" style={{ strokeWidth: 0.1, fill: "none" }}>
          <path d="M50,0 Q60,20 50,40 T50,80 T60,120" strokeDasharray="1 2" className="animate-[dash_30s_linear_infinite]" />
        </svg>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-24 flex flex-col items-center">
        
        {/* HERO PNR SECTION */}
        <div className="w-full max-w-2xl text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold mb-5 tracking-wider border border-orange-200 dark:border-orange-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            SMART JOURNEY ASSISTANT
          </div>
          
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight mb-3 text-slate-900 dark:text-white leading-[1.1]">
              Where are you <span className="text-orange-500">traveling?</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
              Track your route and discover premium local food curated specifically for your journey.
            </p>
          </div>

          <div className="space-y-6 bg-white/40 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/60 dark:border-slate-800/60 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="relative group mx-auto w-full max-w-lg">
              <div className="relative flex items-center bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden p-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500/50">
                <div className="pl-4 pr-1 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={pnr}
                  maxLength={10}
                  onChange={e => { setPnr(e.target.value.replace(/\D/g, "")); setPnrError(""); }}
                  onKeyDown={e => e.key === "Enter" && handlePnrSearch()}
                  placeholder="Enter 10-digit PNR..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg font-semibold placeholder:text-slate-400 py-2.5 px-2 outline-none text-slate-800 dark:text-slate-100"
                />
                <button 
                  onClick={handlePnrSearch}
                  disabled={pnr.length < 5}
                  className="bg-orange-500 dark:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 dark:hover:bg-orange-500 hover:scale-[0.98] active:scale-95 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Track
                </button>
              </div>
            </div>
            
            {pnrError && <p className="text-red-500 text-xs font-bold animate-fade-in">{pnrError}</p>}

            <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Quick Search:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {["2847501234","3921847563","4851209371"].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPnr(p)} 
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* JOURNEY RESULTS */}
        {pnrData && (
          <div className="w-full max-w-4xl space-y-12 animate-fade-in">
            
            {/* Smart Journey Card */}
            <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-orange-500 font-semibold mb-1">
                    <Train className="h-5 w-5" />
                    {pnrData.trainName}
                  </div>
                  <p className="text-slate-500 text-sm">#{pnrData.trainNumber} • Coach <span className="font-bold text-slate-700 dark:text-slate-300">{pnrData.coach}</span> • Seat <span className="font-bold text-slate-700 dark:text-slate-300">{pnrData.seat}</span></p>
                </div>
                <div className="flex-1 md:ml-10">
                  <p className="text-sm font-medium mb-3">Upcoming Stations</p>
                  <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {pnrData.stations.map((s, i) => (
                      <button 
                        key={s} 
                        onClick={() => handleSelectStation(s)}
                        className={`snap-start shrink-0 w-40 p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                          selectedStation === s 
                            ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]" 
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-orange-300 hover:shadow-md"
                        }`}
                      >
                        <div className={`text-xs font-bold mb-2 opacity-80 ${selectedStation === s ? "text-white" : "text-orange-500"}`}>STOP {i+1}</div>
                        <div className="font-display font-bold leading-tight">{s}</div>
                        {selectedStation === s && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vendors Section */}
            {selectedStation && (
              <div id="vendors-section" className="animate-slide-up scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Local Partners at {selectedStation}</h2>
                </div>

                {stationVendors.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    No vendors available at this station yet.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {stationVendors.map(v => (
                      <button 
                        key={v.id} 
                        onClick={() => handleSelectVendor(v)}
                        className={`text-left p-6 rounded-3xl border transition-all duration-300 group ${
                          selectedVendorId === v.id
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl scale-[1.02]"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-orange-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display font-bold text-lg">{v.name}</h3>
                              {v.isSHG && <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold tracking-wider">SHG</span>}
                            </div>
                            <p className={`text-sm ${selectedVendorId === v.id ? "opacity-80" : "text-slate-500"}`}>{v.cuisine.join(" • ")}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedVendorId === v.id ? "bg-white/20 dark:bg-black/10" : "bg-orange-50 dark:bg-orange-950/30 text-orange-500"}`}>
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium mt-4">
                          <span className="flex items-center gap-2 min-w-[4rem]"><Star className={`h-4 w-4 shrink-0 ${selectedVendorId === v.id ? "text-amber-300 fill-amber-300" : "text-amber-400 fill-amber-400"}`} /> {v.hygieneRating}</span>
                          <span className={`flex items-center gap-2 min-w-[4rem] ${selectedVendorId === v.id ? "opacity-80" : "text-slate-500"}`}><Clock className="h-3.5 w-3.5 shrink-0" /> {v.avgDeliveryTime}m</span>
                          {v.fssaiVerified && <span className="flex items-center gap-2 min-w-[4rem] text-green-500"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> FSSAI</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Menu Section */}
            {selectedVendor && (
              <div id="menu-section" className="animate-slide-up scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 text-lg">🍽️</div>
                  <h2 className="text-2xl font-display font-bold">{selectedVendor.name} Menu</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedVendor.menu.filter(i => i.available).map(item => {
                    const ci = items.find(c => c.item.id === item.id);
                    return (
                      <div key={item.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-all">
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-lg">{item.isVeg ? "🟢" : "🔴"}</span>
                            <span className="font-display font-bold text-lg">₹{item.price}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between mt-2 gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-2 min-w-[3rem]"><Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" /> {item.rating}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-2 min-w-[3rem]"><Clock className="h-3 w-3 shrink-0" /> {item.prepTime}m</span>
                          </div>
                          
                          {ci ? (
                            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                              <button onClick={() => updateQty(item.id, ci.qty - 1)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-4 text-center font-bold">{ci.qty}</span>
                              <button onClick={() => addItem(item, selectedVendor.id)} className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => addItem(item, selectedVendor.id)} className="px-5 py-2 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 font-bold text-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                              Add +
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Smart Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 animate-slide-up">
          <button
            onClick={() => navigate("/checkout", { state: { stationName: selectedStation, vendor: selectedVendor, pnrData } })}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full p-2 pl-6 pr-2 shadow-2xl shadow-slate-900/30 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center font-bold text-sm">
                {cartCount}
              </div>
              <span className="font-medium text-sm">View Journey Cart</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 dark:bg-black/5 rounded-full pl-4 pr-3 py-2">
              <span className="font-display font-bold">₹{cartTotal}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* Glassmorphic Login Drawer */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-fade-in" onClick={() => setShowLogin(false)} />
          <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl h-full shadow-2xl animate-slide-left flex flex-col p-8 border-l border-white/20 dark:border-slate-800/50">
            
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <X className="h-5 w-5" />
            </button>

            <div className="mt-12 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 mb-6">
                <User className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Welcome Back</h2>
              <p className="text-slate-500">Sign in to sync your tickets and past orders.</p>
            </div>

            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8 relative">
              <div 
                className="absolute inset-y-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-all duration-300 ease-out"
                style={{ 
                  width: 'calc(33.333% - 4px)', 
                  left: loginMode === 'email' ? '4px' : loginMode === 'phone' ? 'calc(33.333% + 2px)' : 'calc(66.666%)'
                }} 
              />
              {[
                { id: "email", icon: Mail, label: "Email" },
                { id: "phone", icon: Smartphone, label: "Phone" },
                { id: "pin", icon: Lock, label: "PIN" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setLoginMode(m.id as any)}
                  className={`relative z-10 flex-1 flex flex-wrap items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${loginMode === m.id ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <m.icon className="h-4 w-4 shrink-0" /> <span className="shrink-0">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {loginMode === "email" && (
                <>
                  <input type="email" placeholder="Email address" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  <input type="password" placeholder="Password" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </>
              )}
              {loginMode === "phone" && (
                <div className="flex gap-2">
                  <span className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 font-medium flex items-center">🇮🇳 +91</span>
                  <input type="tel" placeholder="Mobile Number" className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
              )}
              {loginMode === "pin" && (
                <div className="flex justify-between gap-2">
                  {[1,2,3,4].map(i => (
                    <input key={i} type="password" maxLength={1} className="w-16 h-16 text-center text-2xl font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  ))}
                </div>
              )}
              <button className="w-full bg-orange-500 text-white rounded-2xl py-4 font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25 mt-4">
                Continue
              </button>
            </div>
            
            <p className="mt-auto text-center text-sm text-slate-400">
              New to RailBite? <button onClick={() => { setShowLogin(false); navigate("/signup") }} className="text-slate-900 dark:text-white font-bold hover:underline">Create an account</button>
            </p>
          </div>
        </div>
      )}

      {/* Add custom animations to global CSS or just inline them if needed. 
          Assuming animate-slide-up, animate-fade-in etc. are in index.css as before.
          Added a dash animation for the route line. */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        .animate-slide-left {
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}