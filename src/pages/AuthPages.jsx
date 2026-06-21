import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signIn, signUp } from "../lib/auth-client";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function passwordValid(password) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  );
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, loading, navigate, redirectTo]);

  if (loading) {
    return <Loader text="Checking session..." />;
  }

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const result = await signIn.email({
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        toast.error(result.error.message || "Login failed");
        return;
      }

      toast.success("Login successful");

      // Important: force page redirect after Better Auth sets cookie/session
      window.location.href = redirectTo;
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${redirectTo}`,
        errorCallbackURL: `${window.location.origin}/login`,
      });
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  }

  return (
    <section className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <span className="eyebrow">Login</span>

        <h1>Continue your reflections</h1>

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />

        <button className="btn primary full" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="btn ghost full"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return <Loader text="Checking session..." />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!passwordValid(form.password)) {
      toast.error(
        "Password must be at least 6 characters and include uppercase and lowercase letters."
      );
      return;
    }

    try {
      setSubmitting(true);

      const result = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.photoURL,
      });

      if (result?.error) {
        toast.error(result.error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully");

      // Important: force reload/redirect after auth cookie is created
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/register`,
      });
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  }

  return (
    <section className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <span className="eyebrow">Register</span>

        <h1>Start your wisdom ledger</h1>

        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />

        <input
          type="url"
          placeholder="Photo URL"
          value={form.photoURL}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, photoURL: e.target.value }))
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />

        <small className="muted">
          Password must have uppercase, lowercase, and minimum 6 characters.
        </small>

        <button className="btn primary full" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Account"}
        </button>

        <button
          type="button"
          className="btn ghost full"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}