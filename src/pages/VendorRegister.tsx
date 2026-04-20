import { useState, useRef } from "react";
import {
  ShieldCheck, Upload, CheckCircle2, AlertTriangle,
  ChefHat, MapPin, Phone, Mail, FileText, Camera,
  IndianRupee, Clock, Star, ArrowRight, ArrowLeft,
  User, Building, BadgeCheck, Loader2, X,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VendorFormData {
  // Step 1 — Personal Info
  ownerName: string;
  phone: string;
  email: string;
  aadhaarNumber: string;
  gender: string;
  isSHG: boolean;
  shgName: string;

  // Step 2 — Business Info
  businessName: string;
  businessType: string;
  station: string;
  address: string;
  yearsInBusiness: string;
  avgDailyOrders: string;

  // Step 3 — FSSAI & Documents
  fssaiNumber: string;
  fssaiExpiry: string;
  fssaiFile: File | null;
  aadhaarFile: File | null;
  shopPhotoFile: File | null;
  panNumber: string;

  // Step 4 — Menu & Pricing
  cuisineType: string[];
  menuItems: { name: string; price: string; category: string }[];
  openTime: string;
  closeTime: string;
  minOrderValue: string;

  // Step 5 — Bank Details
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

const STATIONS = [
  "Lucknow", "Kanpur", "Allahabad", "Varanasi",
  "Patna", "Delhi", "Mumbai CST", "Chennai Central",
  "Kolkata Howrah", "Bangalore City", "Hyderabad",
  "Ahmedabad", "Pune", "Jaipur", "Bhopal",
];

const CUISINE_TYPES = [
  "North Indian", "South Indian", "Bengali", "Punjabi",
  "Gujarati", "Maharashtrian", "Chinese", "Fast Food",
  "Jain Food", "Diabetic-Friendly", "Beverages",
];

const CATEGORY_OPTIONS = ["Veg", "Non-Veg", "Jain", "Diabetic", "Beverage"];

const STEPS = [
  { id: 1, label: "Personal Info",   icon: User },
  { id: 2, label: "Business Info",   icon: Building },
  { id: 3, label: "FSSAI & Docs",    icon: ShieldCheck },
  { id: 4, label: "Menu & Timing",   icon: ChefHat },
  { id: 5, label: "Bank Details",    icon: IndianRupee },
  { id: 6, label: "Review & Submit", icon: BadgeCheck },
];

const defaultForm: VendorFormData = {
  ownerName: "", phone: "", email: "", aadhaarNumber: "",
  gender: "", isSHG: false, shgName: "",
  businessName: "", businessType: "", station: "", address: "",
  yearsInBusiness: "", avgDailyOrders: "",
  fssaiNumber: "", fssaiExpiry: "", fssaiFile: null,
  aadhaarFile: null, shopPhotoFile: null, panNumber: "",
  cuisineType: [],
  menuItems: [{ name: "", price: "", category: "Veg" }],
  openTime: "08:00", closeTime: "22:00", minOrderValue: "50",
  accountHolder: "", accountNumber: "", ifscCode: "",
  bankName: "", upiId: "",
};

// ── File Upload Box ───────────────────────────────────────────────────────────
function FileUploadBox({
  label, hint, accept, file, onFile, icon: Icon,
}: {
  label: string; hint: string; accept: string;
  file: File | null; onFile: (f: File) => void; icon: any;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => ref.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all text-center ${
        file
          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
          : "border-border hover:border-accent/60 bg-background"
      }`}
    >
      <input
        ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      {file ? (
        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">{file.name}</span>
        </div>
      ) : (
        <>
          <Icon className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        </>
      )}
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = "text", required = false, disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition text-sm disabled:opacity-60"
      />
    </div>
  );
}

// ── Select Field ──────────────────────────────────────────────────────────────
function SelectField({
  label, value, onChange, options, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition text-sm"
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-8">
      {/* Mobile: step label only */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">
          Step {current} of {STEPS.length} — {STEPS[current - 1].label}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.round((current / STEPS.length) * 100)}% complete
        </p>
      </div>
      {/* Progress line */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-accent h-2 rounded-full transition-all duration-500"
          style={{ width: `${(current / STEPS.length) * 100}%` }}
        />
      </div>
      {/* Step icons desktop */}
      <div className="hidden sm:flex items-center justify-between mt-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const done = current > step.id;
          const active = current === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                done ? "bg-green-500 text-white"
                : active ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
              }`}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-xs font-medium ${active ? "text-accent" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function VendorRegister() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<VendorFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId] = useState(`RBV-${Date.now().toString().slice(-8)}`);

  const set = (key: keyof VendorFormData, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.ownerName) errs.ownerName = "Name required";
      if (!form.phone || form.phone.length < 10) errs.phone = "Valid phone required";
      if (!form.email || !form.email.includes("@")) errs.email = "Valid email required";
      if (!form.aadhaarNumber || form.aadhaarNumber.length < 12) errs.aadhaarNumber = "12-digit Aadhaar required";
      if (!form.gender) errs.gender = "Gender required";
    }
    if (s === 2) {
      if (!form.businessName) errs.businessName = "Business name required";
      if (!form.businessType) errs.businessType = "Business type required";
      if (!form.station) errs.station = "Station required";
      if (!form.address) errs.address = "Address required";
    }
    if (s === 3) {
      if (!form.fssaiNumber || form.fssaiNumber.length < 14) errs.fssaiNumber = "14-digit FSSAI number required";
      if (!form.fssaiExpiry) errs.fssaiExpiry = "FSSAI expiry date required";
      if (!form.fssaiFile) errs.fssaiFile = "FSSAI certificate upload required";
      if (!form.aadhaarFile) errs.aadhaarFile = "Aadhaar upload required";
    }
    if (s === 4) {
      if (form.cuisineType.length === 0) errs.cuisineType = "Select at least one cuisine";
      const validItems = form.menuItems.filter((m) => m.name && m.price);
      if (validItems.length === 0) errs.menuItems = "Add at least one menu item";
    }
    if (s === 5) {
      if (!form.accountHolder) errs.accountHolder = "Account holder name required";
      if (!form.accountNumber || form.accountNumber.length < 9) errs.accountNumber = "Valid account number required";
      if (!form.ifscCode || form.ifscCode.length < 11) errs.ifscCode = "Valid IFSC code required";
      if (!form.bankName) errs.bankName = "Bank name required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() { if (validate(step)) setStep((s) => s + 1); }
  function back() { setStep((s) => s - 1); }

  async function handleSubmit() {
    if (!validate(5)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  }

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="bg-card rounded-3xl p-10 border border-green-200 dark:border-green-800 shadow-xl max-w-lg w-full text-center">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground mb-5">
            Your vendor onboarding application has been received. Our team will verify
            your FSSAI certificate and documents within 48 hours.
          </p>

          {/* Application ID */}
          <div className="bg-background border border-border rounded-2xl p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Application ID</p>
            <p className="font-mono font-bold text-accent text-lg">{applicationId}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Save this for tracking your application status
            </p>
          </div>

          {/* What happens next */}
          <div className="text-left space-y-3 mb-6">
            <p className="text-sm font-semibold text-foreground mb-2">What happens next:</p>
            {[
              { step: "1", text: "FSSAI verification — 24 hrs", color: "bg-green-500" },
              { step: "2", text: "Document review — 48 hrs", color: "bg-blue-500" },
              { step: "3", text: "Account activation & training", color: "bg-purple-500" },
              { step: "4", text: "Go live & start earning!", color: "bg-orange-500" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full ${item.color} text-white text-xs flex items-center justify-center font-bold flex-shrink-0`}>
                  {item.step}
                </div>
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="/vendor"
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:shadow-lg transition-all text-center"
            >
              Go to Vendor Dashboard
            </a>
            <a
              href="/"
              className="w-full py-3 rounded-xl bg-background border border-border text-foreground font-semibold text-sm hover:shadow transition-all text-center"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-6 text-center">
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-2xl p-3 w-fit mx-auto mb-3">
            <ChefHat className="h-7 w-7 text-orange-500" />
          </div>
          <h1 className="font-display text-2xl font-bold">Vendor Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join RailBite Bharat — Serve 700M+ railway passengers
          </p>
        </div>

        {/* ── Benefits Banner ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: IndianRupee, label: "T+1 Payouts", sub: "Next day transfer", color: "text-green-500" },
            { icon: Star, label: "FSSAI Support", sub: "We help you get certified", color: "text-yellow-500" },
            { icon: Users, label: "SHG Welcome", sub: "Women-first onboarding", color: "text-purple-500" },
          ].map((b) => (
            <div key={b.label} className="bg-card rounded-xl p-3 border border-border text-center">
              <b.icon className={`h-5 w-5 ${b.color} mx-auto mb-1`} />
              <p className="text-xs font-bold text-foreground">{b.label}</p>
              <p className="text-xs text-muted-foreground">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Progress ─────────────────────────────────────────────────────── */}
        <StepProgress current={step} />

        {/* ── STEP 1: Personal Info ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
            <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-accent" /> Personal Information
            </h2>
            <div className="space-y-4">
              <Field label="Full Name (as per Aadhaar)" value={form.ownerName} onChange={(v) => set("ownerName", v)} placeholder="e.g. Raju Kumar Sharma" required />
              {errors.ownerName && <p className="text-xs text-red-500 -mt-2">{errors.ownerName}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field label="Mobile Number" value={form.phone} onChange={(v) => set("phone", v)} placeholder="10-digit mobile" type="tel" required />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Field label="Email Address" value={form.email} onChange={(v) => set("email", v)} placeholder="your@email.com" type="email" required />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field label="Aadhaar Number" value={form.aadhaarNumber} onChange={(v) => set("aadhaarNumber", v)} placeholder="12-digit Aadhaar" required />
                  {errors.aadhaarNumber && <p className="text-xs text-red-500 mt-1">{errors.aadhaarNumber}</p>}
                </div>
                <div>
                  <SelectField label="Gender" value={form.gender} onChange={(v) => set("gender", v)} options={["Male", "Female", "Other"]} required />
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* SHG Toggle */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      Self Help Group (SHG) Member?
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                      Women SHG vendors get priority listing & extra incentives
                    </p>
                  </div>
                  <button
                    onClick={() => set("isSHG", !form.isSHG)}
                    className={`w-12 h-6 rounded-full transition-all ${form.isSHG ? "bg-purple-500" : "bg-muted"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${form.isSHG ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
                {form.isSHG && (
                  <div className="mt-3">
                    <Field label="SHG Name" value={form.shgName} onChange={(v) => set("shgName", v)} placeholder="e.g. Mahila Shakti SHG" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Business Info ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
            <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
              <Building className="h-5 w-5 text-accent" /> Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <Field label="Business / Stall Name" value={form.businessName} onChange={(v) => set("businessName", v)} placeholder="e.g. Shree Sai Tiffin Center" required />
                {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SelectField label="Business Type" value={form.businessType} onChange={(v) => set("businessType", v)}
                    options={["Food Stall", "Tiffin Center", "Restaurant", "Home Kitchen", "SHG Kitchen", "Cloud Kitchen"]} required />
                  {errors.businessType && <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>}
                </div>
                <div>
                  <SelectField label="Railway Station" value={form.station} onChange={(v) => set("station", v)} options={STATIONS} required />
                  {errors.station && <p className="text-xs text-red-500 mt-1">{errors.station}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Shop no., Street, Near Station..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition text-sm resize-none h-20"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Years in Business" value={form.yearsInBusiness} onChange={(v) => set("yearsInBusiness", v)} placeholder="e.g. 5" type="number" />
                <Field label="Avg Daily Orders (Current)" value={form.avgDailyOrders} onChange={(v) => set("avgDailyOrders", v)} placeholder="e.g. 50" type="number" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: FSSAI & Documents ─────────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
            <h2 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" /> FSSAI & Documents
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              FSSAI certification is mandatory. Don't have one?
              <a href="https://foscos.fssai.gov.in" target="_blank" rel="noreferrer" className="text-accent ml-1 underline">
                Apply at foscos.fssai.gov.in
              </a>
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field label="FSSAI License Number" value={form.fssaiNumber} onChange={(v) => set("fssaiNumber", v)} placeholder="14-digit FSSAI number" required />
                  {errors.fssaiNumber && <p className="text-xs text-red-500 mt-1">{errors.fssaiNumber}</p>}
                </div>
                <div>
                  <Field label="FSSAI Expiry Date" value={form.fssaiExpiry} onChange={(v) => set("fssaiExpiry", v)} type="date" required />
                  {errors.fssaiExpiry && <p className="text-xs text-red-500 mt-1">{errors.fssaiExpiry}</p>}
                </div>
              </div>

              <div>
                <Field label="PAN Number (Optional)" value={form.panNumber} onChange={(v) => set("panNumber", v)} placeholder="e.g. ABCDE1234F" />
              </div>

              {/* File Uploads */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Document Uploads
                </p>

                <div>
                  <FileUploadBox
                    label="Upload FSSAI Certificate"
                    hint="PDF or Image · Max 5MB"
                    accept=".pdf,.jpg,.jpeg,.png"
                    file={form.fssaiFile}
                    onFile={(f) => set("fssaiFile", f)}
                    icon={FileText}
                  />
                  {errors.fssaiFile && <p className="text-xs text-red-500 mt-1">{errors.fssaiFile}</p>}
                </div>

                <div>
                  <FileUploadBox
                    label="Upload Aadhaar Card"
                    hint="Front & Back · PDF or Image"
                    accept=".pdf,.jpg,.jpeg,.png"
                    file={form.aadhaarFile}
                    onFile={(f) => set("aadhaarFile", f)}
                    icon={Upload}
                  />
                  {errors.aadhaarFile && <p className="text-xs text-red-500 mt-1">{errors.aadhaarFile}</p>}
                </div>

                <FileUploadBox
                  label="Upload Shop / Kitchen Photo"
                  hint="Clear photo of your stall or kitchen"
                  accept=".jpg,.jpeg,.png"
                  file={form.shopPhotoFile}
                  onFile={(f) => set("shopPhotoFile", f)}
                  icon={Camera}
                />
              </div>

              {/* FSSAI info box */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Why FSSAI matters?
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                    FSSAI-verified vendors get a green badge on their listing, higher customer trust,
                    priority order allocation and protection against complaints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Menu & Timing ─────────────────────────────────────────── */}
        {step === 4 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
            <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-orange-500" /> Menu & Timings
            </h2>
            <div className="space-y-5">

              {/* Cuisine Types */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Cuisine Types <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUISINE_TYPES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        const curr = form.cuisineType;
                        set("cuisineType", curr.includes(c) ? curr.filter((x) => x !== c) : [...curr, c]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.cuisineType.includes(c)
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-background text-muted-foreground border-border hover:border-accent/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.cuisineType && <p className="text-xs text-red-500 mt-1">{errors.cuisineType}</p>}
              </div>

              {/* Menu Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Menu Items <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => set("menuItems", [...form.menuItems, { name: "", price: "", category: "Veg" }])}
                    className="text-xs text-accent font-semibold hover:underline"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {form.menuItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text" placeholder="Item name" value={item.name}
                        onChange={(e) => {
                          const items = [...form.menuItems];
                          items[idx] = { ...items[idx], name: e.target.value };
                          set("menuItems", items);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition text-sm"
                      />
                      <input
                        type="number" placeholder="₹ Price" value={item.price}
                        onChange={(e) => {
                          const items = [...form.menuItems];
                          items[idx] = { ...items[idx], price: e.target.value };
                          set("menuItems", items);
                        }}
                        className="w-24 px-3 py-2 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition text-sm"
                      />
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const items = [...form.menuItems];
                          items[idx] = { ...items[idx], category: e.target.value };
                          set("menuItems", items);
                        }}
                        className="w-28 px-2 py-2 rounded-xl bg-background border border-input text-foreground focus:ring-2 focus:ring-accent outline-none transition text-sm"
                      >
                        {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {form.menuItems.length > 1 && (
                        <button
                          onClick={() => set("menuItems", form.menuItems.filter((_, i) => i !== idx))}
                          className="text-destructive hover:bg-destructive/10 rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.menuItems && <p className="text-xs text-red-500 mt-1">{errors.menuItems}</p>}
              </div>

              {/* Timings */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Opening Time" value={form.openTime} onChange={(v) => set("openTime", v)} type="time" />
                <Field label="Closing Time" value={form.closeTime} onChange={(v) => set("closeTime", v)} type="time" />
                <Field label="Min Order (₹)" value={form.minOrderValue} onChange={(v) => set("minOrderValue", v)} type="number" placeholder="50" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Bank Details ──────────────────────────────────────────── */}
        {step === 5 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
            <h2 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-green-500" /> Bank & Payment Details
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              Your earnings will be transferred to this account every T+1 day (next business day).
            </p>
            <div className="space-y-4">
              <div>
                <Field label="Account Holder Name" value={form.accountHolder} onChange={(v) => set("accountHolder", v)} placeholder="As per bank records" required />
                {errors.accountHolder && <p className="text-xs text-red-500 mt-1">{errors.accountHolder}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field label="Account Number" value={form.accountNumber} onChange={(v) => set("accountNumber", v)} placeholder="Bank account number" required />
                  {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
                </div>
                <div>
                  <Field label="IFSC Code" value={form.ifscCode} onChange={(v) => set("ifscCode", v.toUpperCase())} placeholder="e.g. SBIN0001234" required />
                  {errors.ifscCode && <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>}
                </div>
              </div>

              <div>
                <SelectField label="Bank Name" value={form.bankName} onChange={(v) => set("bankName", v)}
                  options={["SBI", "PNB", "Bank of Baroda", "Canara Bank", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "UCO Bank", "Other"]}
                  required />
                {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
              </div>

              <Field label="UPI ID (Optional)" value={form.upiId} onChange={(v) => set("upiId", v)} placeholder="e.g. raju@upi" />

              {/* Payout Info */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  Payout Structure
                </p>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div>
                    <p className="font-bold text-green-600 text-base">90%</p>
                    <p className="text-muted-foreground">Your earnings</p>
                  </div>
                  <div>
                    <p className="font-bold text-accent text-base">7%</p>
                    <p className="text-muted-foreground">Platform fee</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-500 text-base">3%</p>
                    <p className="text-muted-foreground">IRCTC share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: Review & Submit ───────────────────────────────────────── */}
        {step === 6 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in space-y-4">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-green-500" /> Review Your Application
            </h2>

            {/* Summary sections */}
            {[
              {
                title: "Personal Info",
                rows: [
                  ["Name", form.ownerName],
                  ["Phone", form.phone],
                  ["Email", form.email],
                  ["Aadhaar", `****${form.aadhaarNumber.slice(-4)}`],
                  ["SHG Member", form.isSHG ? `Yes — ${form.shgName}` : "No"],
                ],
              },
              {
                title: "Business Info",
                rows: [
                  ["Business Name", form.businessName],
                  ["Type", form.businessType],
                  ["Station", form.station],
                  ["Address", form.address],
                ],
              },
              {
                title: "FSSAI & Documents",
                rows: [
                  ["FSSAI Number", form.fssaiNumber],
                  ["Expiry", form.fssaiExpiry],
                  ["Certificate", form.fssaiFile?.name || "Not uploaded"],
                  ["Aadhaar Doc", form.aadhaarFile?.name || "Not uploaded"],
                ],
              },
              {
                title: "Bank Details",
                rows: [
                  ["Account Holder", form.accountHolder],
                  ["Account No", `****${form.accountNumber.slice(-4)}`],
                  ["IFSC", form.ifscCode],
                  ["Bank", form.bankName],
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-background rounded-xl border border-border p-4">
                <p className="text-xs font-bold text-accent uppercase tracking-wide mb-3">
                  {section.title}
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {section.rows.map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-medium truncate">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Terms */}
            <div className="bg-muted/40 rounded-xl p-4 text-xs text-muted-foreground">
              By submitting, you agree to RailBite Bharat's vendor terms, FSSAI compliance
              requirements, and authorize us to verify your documents. False information will
              result in permanent account suspension.
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6 gap-3">
          {step > 1 ? (
            <button
              onClick={back}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:shadow transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-saffron text-accent-foreground font-semibold text-sm hover:shadow-lg transition-all ml-auto"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm hover:shadow-lg transition-all ml-auto disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Submit Application</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// missing import fix
function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}