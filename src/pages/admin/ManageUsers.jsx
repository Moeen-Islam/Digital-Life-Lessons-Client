import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() { const { data } = await api.get("/users"); setUsers(data.users); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function role(email, value) { await api.patch(`/users/${email}/role`, { role: value }); toast.success("Role updated"); load(); }
  async function remove(email) { await api.delete(`/users/${email}`); toast.success("User deleted from app profile"); load(); }
  if (loading) return <Loader />;
  return <div><h1>Manage Users</h1><div className="tableWrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Total lessons</th><th>Actions</th></tr></thead><tbody>{users.map((u) => <tr key={u.email}><td>{u.name}</td><td>{u.email}</td><td><select value={u.role} onChange={(e) => role(u.email, e.target.value)}><option>user</option><option>admin</option></select></td><td>{u.totalLessons}</td><td><button onClick={() => remove(u.email)}>Delete</button></td></tr>)}</tbody></table></div></div>;
}
