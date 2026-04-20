import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Upload, Building2, FileText, CreditCard, Eye, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  { id: 1, title: "Business Info", icon: Building2, emoji: "🏪" },
  { id: 2, title: "Documents", icon: FileText, emoji: "📄" },
  { id: 3, title: "Menu Setup", icon: "🍽️" },
  { id: 4, title: "Bank Details", icon: CreditCard, emoji: "🏦" },
  { id: 5, title: "Review", icon: Eye, emoji: "✅" },
];

const STATION_OPTIONS = [
  "New Delhi", "Mumbai Central", "Chennai Central", "Howrah Junction",
  "Lucknow", "Kanpur Central", "Varanasi Junction", "Prayagraj Junction",
  "Jaipur", "Ahmedabad Junction", "Bangalore City", "Hyderabad Deccan",
];

export default function VendorRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [bizInfo, setBizInfo] = useState({ name: "", owner: "", type: "individual", stations: [] as string[], address: "", years: "" });
  const [docs, setDocs] = useState({ fssai: "", gstin: "", pan: "", aadhaar: "" });
  const [menuItems, setMenuItems] = useState([{ name: "", price: "", category: "Main Course", isVeg: true }]);
  const [bankInfo, setBankInfo] = useState({ accountName: "", accountNumber: "", ifsc: "", upi: "" });

  function toggleStation(s: string) {
    setBizInfo(b => ({
      ...b,
      stations: b.stations.includes(s) ? b.stations.filter(x => x !== s) : [...b.stations, s],
    }));
  }

  function addMenuItem() {
    setMenuItems(m => [...m, { name: "", price: "", category: "Main Course", isVeg: true }]);
  }

  async function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-10 border border-border text-center max-w-md w-full animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-2">Your vendor application for <strong>{bizInfo.name}</strong> is under review.</p>
          <p className="text-sm text-muted-foreground mb-6">You'll receive an email confirmation within 24–48 hours.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl text-sm">
              <span className="w-6 h-6 rounded-full gradient-saffron text-white flex items-center justify-center text-xs font-bold">1</span>
              Application received & logged
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl text-sm">
              <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</span>
              Document verification (1–2 days)
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl text-sm">
              <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</span>
              Go live on RailBite Bharat!
            </div>
          </div>
          <button onClick={() => navigate("/")} className="btn-primary w-full mt-6">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">Join India's smart railway food network</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const active = step >= s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${active ? "gradient-saffron text-white shadow-md" : "bg-muted text-muted-foreground"} ${current ? "scale-110" : ""}`}>
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block whitespace-nowrap ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${active ? "bg-accent" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 animate-slide-up">

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">🏪 Business Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Business Name *</label>
                  <input value={bizInfo.name} onChange={e => setBizInfo(b => ({...b, name: e.target.value}))} placeholder="e.g. Shree Sai Tiffin" className="input-base" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Owner Name *</label>
                  <input value={bizInfo.owner} onChange={e => setBizInfo(b => ({...b, owner: e.target.value}))} placeholder="Full name" className="input-base" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Type</label>
                  <select value={bizInfo.type} onChange={e => setBizInfo(b => ({...b, type: e.target.value}))} className="input-base">
                    <option value="individual">Individual</option>
                    <option value="partnership">Partnership</option>
                    <option value="company">Company</option>
                    <option value="shg">SHG</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">Stations Served * <span className="text-muted-foreground font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {STATION_OPTIONS.map(s => (
                      <button key={s} type="button" onClick={() => toggleStation(s)}
                        className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${bizInfo.stations.includes(s) ? "border-accent bg-accent/10 text-accent font-medium" : "border-border hover:border-accent/50"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Kitchen Address *</label>
                  <input value={bizInfo.address} onChange={e => setBizInfo(b => ({...b, address: e.target.value}))} placeholder="Platform no., street, city" className="input-base" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Years in Operation</label>
                  <input type="number" value={bizInfo.years} onChange={e => setBizInfo(b => ({...b, years: e.target.value}))} placeholder="e.g. 5" className="input-base" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">📄 Document Upload</h2>
              <p className="text-sm text-muted-foreground">All documents are securely stored in Firebase Storage. Accepted: PDF, JPG, PNG (max 5MB)</p>
              {[
                { key: "fssai", label: "FSSAI License *", hint: "14-digit license number" },
                { key: "gstin", label: "GSTIN", hint: "GST registration certificate" },
                { key: "pan", label: "PAN Card *", hint: "PAN card of business owner" },
                { key: "aadhaar", label: "Aadhaar Card *", hint: "Last 4 digits shown only" },
              ].map(d => (
                <div key={d.key}>
                  <label className="text-sm font-medium mb-1 block">{d.label}</label>
                  <div className="flex gap-3">
                    <input
                      value={docs[d.key as keyof typeof docs]}
                      onChange={e => setDocs(dd => ({...dd, [d.key]: e.target.value}))}
                      placeholder={d.hint}
                      className="input-base flex-1"
                    />
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm">
                      <Upload className="h-4 w-4" /> Upload
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
                💡 <strong>FSSAI Tip:</strong> Apply at foodlicensing.fssai.gov.in for a Basic Registration (₹100/year). Our team can assist SHG groups.
              </div>
            </div>
          )}

          {/* Step 3: Menu Setup */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">🍽️ Menu Setup</h2>
              <p className="text-sm text-muted-foreground">Add your food items. You can edit these anytime from the Vendor Dashboard.</p>
              <div className="space-y-3">
                {menuItems.map((item, i) => (
                  <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Item Name *</label>
                        <input value={item.name} onChange={e => { const m = [...menuItems]; m[i].name = e.target.value; setMenuItems(m); }} placeholder="e.g. Paneer Biryani" className="input-base py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Price (₹) *</label>
                        <input type="number" value={item.price} onChange={e => { const m = [...menuItems]; m[i].price = e.target.value; setMenuItems(m); }} placeholder="e.g. 180" className="input-base py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Category</label>
                        <select value={item.category} onChange={e => { const m = [...menuItems]; m[i].category = e.target.value; setMenuItems(m); }} className="input-base py-2 text-sm">
                          <option>Main Course</option>
                          <option>Breakfast</option>
                          <option>Snacks</option>
                          <option>Beverage</option>
                          <option>Dessert</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => { const m = [...menuItems]; m[i].isVeg = !m[i].isVeg; setMenuItems(m); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all w-full justify-center ${item.isVeg ? "border-green-500 bg-green-500/10 text-green-600" : "border-red-500 bg-red-500/10 text-red-600"}`}
                        >
                          {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addMenuItem} className="btn-secondary w-full text-sm">+ Add Another Item</button>
            </div>
          )}

          {/* Step 4: Bank Details */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">🏦 Bank Details</h2>
              <p className="text-sm text-muted-foreground">Your earnings are disbursed T+1 after order delivery via Razorpay escrow.</p>
              {[
                { key: "accountName", label: "Account Holder Name *", placeholder: "As per bank records" },
                { key: "accountNumber", label: "Account Number *", placeholder: "Enter bank account number" },
                { key: "ifsc", label: "IFSC Code *", placeholder: "e.g. SBIN0001234" },
                { key: "upi", label: "UPI ID (Alternative)", placeholder: "e.g. vendor@upi" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium mb-1 block">{f.label}</label>
                  <input
                    value={bankInfo[f.key as keyof typeof bankInfo]}
                    onChange={e => setBankInfo(b => ({...b, [f.key]: e.target.value}))}
                    placeholder={f.placeholder}
                    className="input-base"
                  />
                </div>
              ))}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-sm text-green-800 dark:text-green-300">
                🔒 Bank details are encrypted and verified via penny drop. Platform commission: 8% per order.
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">✅ Review & Submit</h2>
              <div className="space-y-3">
                {[
                  { label: "Business", value: `${bizInfo.name} (${bizInfo.type})`, icon: "🏪" },
                  { label: "Owner", value: bizInfo.owner || "—", icon: "👤" },
                  { label: "Stations", value: bizInfo.stations.join(", ") || "—", icon: "📍" },
                  { label: "Menu Items", value: `${menuItems.filter(m => m.name).length} items added`, icon: "🍽️" },
                  { label: "FSSAI", value: docs.fssai || "Pending", icon: "📋" },
                  { label: "Bank", value: bankInfo.accountName ? `${bankInfo.accountName} • ${bankInfo.ifsc}` : "—", icon: "🏦" },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <span className="text-xl w-8">{row.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{row.label}</div>
                      <div className="text-sm font-medium truncate">{row.value}</div>
                    </div>
                    <button onClick={() => setStep(STEPS.findIndex(s => s.title.toLowerCase().includes(row.label.toLowerCase().split(" ")[0])) + 1 || 1)} className="text-xs text-accent hover:underline shrink-0">Edit</button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">By submitting, you agree to RailBite Bharat's vendor terms, FSSAI compliance requirements, and IRCTC guidelines.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
            {step < 5 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}