import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
export const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function LessonForm({ initial, mode = "create" }) {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial || { title: "", description: "", category: categories[0], emotionalTone: tones[0], image: "", visibility: "Public", accessLevel: "Free" });

  async function submit(e) {
    e.preventDefault();
    try {
      if (mode === "update") {
        await api.put(`/lessons/${initial._id}`, form);
        toast.success("Lesson updated successfully");
      } else {
        await api.post("/lessons", form);
        toast.success("Lesson created successfully");
      }
      navigate("/dashboard/my-lessons");
    } catch (error) { toast.error(error.friendlyMessage); }
  }

  return (
    <form className="formCard" onSubmit={submit}>
      <label>Lesson Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
      <label>Full Description / Story / Insight<textarea rows="8" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
      <div className="formGrid"><label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label><label>Emotional Tone<select value={form.emotionalTone} onChange={(e) => setForm({ ...form, emotionalTone: e.target.value })}>{tones.map((t) => <option key={t}>{t}</option>)}</select></label></div>
      <label>Image URL optional<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></label>
      <div className="formGrid"><label>Visibility<select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}><option>Public</option><option>Private</option></select></label><label title={!isPremium ? "Upgrade to Premium to create paid lessons." : ""}>Access Level<select value={isPremium ? form.accessLevel : "Free"} disabled={!isPremium} onChange={(e) => setForm({ ...form, accessLevel: e.target.value })}><option>Free</option><option>Premium</option></select>{!isPremium && <small>Upgrade to Premium to create paid lessons.</small>}</label></div>
      <button className="btn primary">{mode === "update" ? "Update Lesson" : "Create Lesson"}</button>
    </form>
  );
}
