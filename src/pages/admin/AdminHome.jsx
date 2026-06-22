import { useEffect, useState } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then(({ data }) => setStats(data)); }, []);
  if (!stats) return <Loader />;
  return <div><h1>Admin Dashboard</h1><div className="statGrid"><div><span>Total users</span><strong>{stats.totalUsers}</strong></div><div><span>Public lessons</span><strong>{stats.totalPublicLessons}</strong></div><div><span>Reported lessons</span><strong>{stats.totalReports}</strong></div><div><span>Today's new lessons</span><strong>{stats.todayLessons}</strong></div></div><div className="chartCard"><h2>Lesson Growth</h2><ResponsiveContainer width="100%" height={260}><LineChart data={stats.lessonGrowth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="lessons" /></LineChart></ResponsiveContainer></div><h2>Most Active Contributors</h2><div className="miniLessonList">{stats.activeContributors.map((item) => <span key={item._id}>{item.name} — {item.count} lessons</span>)}</div></div>;
}
