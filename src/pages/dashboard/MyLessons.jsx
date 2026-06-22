import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

export default function MyLessons() {
  const { isPremium } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() { const { data } = await api.get("/lessons/mine"); setLessons(data.lessons); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function patch(id, body) { await api.patch(`/lessons/${id}/settings`, body); toast.success("Updated"); load(); }
  async function remove(id) {
    const ok = await Swal.fire({ title: "Delete permanently?", text: "This cannot be undone.", showCancelButton: true, confirmButtonText: "Delete", icon: "warning" });
    if (ok.isConfirmed) { await api.delete(`/lessons/${id}`); toast.success("Deleted"); load(); }
  }

  if (loading) return <Loader />;
  return (
    <div><h1>My Lessons</h1><div className="tableWrap"><table><thead><tr><th>Title</th><th>Visibility</th><th>Access</th><th>Stats</th><th>Created</th><th>Actions</th></tr></thead><tbody>{lessons.map((lesson) => <tr key={lesson._id}><td>{lesson.title}</td><td><select value={lesson.visibility} onChange={(e) => patch(lesson._id, { visibility: e.target.value })}><option>Public</option><option>Private</option></select></td><td><select value={lesson.accessLevel} disabled={!isPremium} onChange={(e) => patch(lesson._id, { accessLevel: e.target.value })}><option>Free</option><option>Premium</option></select></td><td>❤️ {lesson.likesCount || 0} / 🔖 {lesson.favoritesCount || 0}</td><td>{new Date(lesson.createdAt).toLocaleDateString()}</td><td className="rowActions"><Link to={`/lessons/${lesson._id}`}>Details</Link><Link to={`/dashboard/update-lesson/${lesson._id}`}>Update</Link><button onClick={() => remove(lesson._id)}>Delete</button></td></tr>)}</tbody></table></div></div>
  );
}
