import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import LessonCard from "../../components/LessonCard";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", photoURL: "" });
  const [lessons, setLessons] = useState([]);
  useEffect(() => { if (user) setForm({ name: user.name || "", photoURL: user.photoURL || "" }); }, [user]);
  useEffect(() => { api.get("/lessons/mine").then(({ data }) => setLessons(data.lessons.filter((l) => l.visibility === "Public"))); }, []);
  async function save(e) { e.preventDefault(); await api.patch("/users/me", form); await refreshUser(); toast.success("Profile updated"); }
  return <div><h1>Profile</h1><div className="profileCard"><img src={user?.photoURL || "https://api.dicebear.com/9.x/initials/svg?seed=Profile"} alt={user?.name} /><div><h2>{user?.name}</h2><p>{user?.email}</p><span className="premiumBadge">{user?.isPremium ? "Premium ⭐" : "Free Plan"}</span><p>{user?.lessonsCount || 0} lessons created • {user?.savedCount || 0} saved</p></div></div><form className="formCard compact" onSubmit={save}><label>Display name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Photo URL<input value={form.photoURL} onChange={(e) => setForm({ ...form, photoURL: e.target.value })} /></label><button className="btn primary">Update Profile</button></form><h2>My Public Lessons</h2><div className="cardGrid">{lessons.map((lesson) => <LessonCard key={lesson._id} lesson={lesson} />)}</div></div>;
}
