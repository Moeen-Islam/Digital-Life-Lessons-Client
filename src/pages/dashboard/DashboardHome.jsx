import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

export default function DashboardHome() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/lessons/mine").then(({ data }) => setLessons(data.lessons)).finally(() => setLoading(false)); }, []);
  const chartData = Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, lessons: lessons.filter((_, idx) => idx % 7 === i).length + Math.floor(Math.random() * 2) }));
  if (loading) return <Loader />;
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <div className="statGrid"><div><span>Total lessons</span><strong>{user?.lessonsCount || lessons.length}</strong></div><div><span>Total saved</span><strong>{user?.savedCount || 0}</strong></div><div><span>Plan</span><strong>{user?.isPremium ? "Premium ⭐" : "Free"}</strong></div><div><span>Recently added</span><strong>{lessons.slice(0, 3).length}</strong></div></div>
      <div className="quickLinks"><Link className="btn primary" to="/dashboard/add-lesson">Add Lesson</Link><Link className="btn ghost" to="/public-lessons">Browse Public Lessons</Link><Link className="btn ghost" to="/dashboard/my-favorites">My Favorites</Link></div>
      <div className="chartCard"><h2>Weekly reflections</h2><ResponsiveContainer width="100%" height={260}><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis allowDecimals={false} /><Tooltip /><Area type="monotone" dataKey="lessons" /></AreaChart></ResponsiveContainer></div>
      <h2>Recently added lessons</h2><div className="tableWrap"><table><tbody>{lessons.slice(0, 5).map((lesson) => <tr key={lesson._id}><td>{lesson.title}</td><td>{lesson.category}</td><td>{new Date(lesson.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>
    </div>
  );
}
