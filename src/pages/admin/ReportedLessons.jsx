import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";

export default function ReportedLessons() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() { const { data } = await api.get("/lessons/admin/reports"); setReports(data.reports); setLoading(false); }
  useEffect(() => { load(); }, []);
  function viewReasons(report) { Swal.fire({ title: report.lessonTitle, html: report.reasons.map((r) => `<p><b>${r.reason}</b><br/><small>${r.reporterUserId}</small></p>`).join(""), width: 650 }); }
  async function ignore(id) { await api.delete(`/lessons/admin/reports/${id}`); toast.success("Reports cleared"); load(); }
  async function removeLesson(id) { await api.delete(`/lessons/${id}`); toast.success("Lesson deleted"); load(); }
  if (loading) return <Loader />;
  return <div><h1>Reported / Flagged Lessons</h1><div className="tableWrap"><table><thead><tr><th>Lesson title</th><th>Report count</th><th>Actions</th></tr></thead><tbody>{reports.map((r) => <tr key={r._id}><td>{r.lessonTitle}</td><td>{r.count}</td><td className="rowActions"><button onClick={() => viewReasons(r)}>View reasons</button><button onClick={() => removeLesson(r._id)}>Delete Lesson</button><button onClick={() => ignore(r._id)}>Ignore</button></td></tr>)}</tbody></table></div></div>;
}
