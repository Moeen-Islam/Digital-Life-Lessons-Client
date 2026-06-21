import { CheckCircle2, Crown } from "lucide-react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SectionTitle from "../components/SectionTitle";

const rows = [
  ["Lessons that can be created", "Up to 10", "Unlimited"],
  ["Premium lesson creation", "No", "Yes"],
  ["Ad-free experience", "Limited", "Included"],
  ["Priority listing in public lessons", "No", "Yes"],
  ["Access to premium community lessons", "No", "Yes"],
  ["Community badge", "Free member", "Premium ⭐"],
  ["Export lessons as PDF", "Basic", "Included"],
  ["Lifetime access", "Free", "৳1500 one-time"]
];

export default function Pricing() {
  const { isPremium } = useAuth();
  if (isPremium) return <Navigate to="/dashboard" replace />;

  async function upgrade() {
    try {
      const { data } = await api.post("/payments/create-checkout-session");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.friendlyMessage);
    }
  }

  return (
    <section className="container section pricingPage">
      <SectionTitle eyebrow="Upgrade" title="Choose Premium Lifetime" text="Unlock premium lessons, create paid lessons, and receive a Premium badge." />
      <div className="pricingCard">
        <div><Crown /><h3>Premium Lifetime</h3><p className="price">৳1500</p><p>One-time payment. No subscription.</p></div>
        <button className="btn primary" onClick={upgrade}>Choose Premium Plan</button>
      </div>
      <table className="compareTable"><thead><tr><th>Feature</th><th>Free</th><th>Premium</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td><CheckCircle2 size={16} /> {row[2]}</td></tr>)}</tbody></table>
    </section>
  );
}
