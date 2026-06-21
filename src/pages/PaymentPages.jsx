import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

export function PaymentSuccess() {
  return <section className="statusPage"><CheckCircle2 className="successIcon" /><h1>Payment successful</h1><p>Your Premium access will be activated by the Stripe webhook. Refresh your dashboard after a moment.</p><Link className="btn primary" to="/dashboard/profile">Go to Profile</Link></section>;
}

export function PaymentCancel() {
  return <section className="statusPage"><XCircle className="dangerIcon" /><h1>Payment canceled</h1><p>No payment was completed. You can try again from the pricing page.</p><Link className="btn primary" to="/pricing">Back to Pricing</Link></section>;
}
