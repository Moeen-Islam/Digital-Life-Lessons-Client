import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";
import { categories, tones } from "./LessonForm";

export default function MyFavorites() {
  const [lessons, setLessons] = useState([]);
  const [filters, setFilters] = useState({ category: "", tone: "" });
  const [loading, setLoading] = useState(true);
  async function load() { const { data } = await api.get("/lessons/user/favorites"); setLessons(data.lessons); setLoading(false); }
  useEffect(() => { load(); }, []);
  const shown = useMemo(() => lessons.filter((l) => (!filters.category || l.category === filters.category) && (!filters.tone || l.emotionalTone === filters.tone)), [lessons, filters]);
  async function remove(id) { await api.post(`/lessons/${id}/favorite`); toast.success("Removed from favorites"); load(); }
  if (loading) return <Loader />;
  return <div><h1>My Favorites</h1><div className="filtersBar"><select onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select><select onChange={(e) => setFilters({ ...filters, tone: e.target.value })}><option value="">All tones</option>{tones.map((t) => <option key={t}>{t}</option>)}</select></div><div className="tableWrap"><table><thead><tr><th>Title</th><th>Category</th><th>Tone</th><th>Actions</th></tr></thead><tbody>{shown.map((lesson) => <tr key={lesson._id}><td>{lesson.title}</td><td>{lesson.category}</td><td>{lesson.emotionalTone}</td><td className="rowActions"><Link to={`/lessons/${lesson._id}`}>Details</Link><button onClick={() => remove(lesson._id)}>Remove</button></td></tr>)}</tbody></table></div></div>;
}
