import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Star, Trash2, Eye, ShieldCheck } from "lucide-react";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";

export default function ManageLessons() {
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    visibility: "",
    flags: ""
  });

  async function load() {
    try {
      setLoading(true);

      const { data } = await api.get("/lessons/admin/all", {
        params: filters
      });

      setLessons(data.lessons || []);
      setStats(data.stats || {});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters]);

  async function patch(id, body, message = "Updated successfully") {
    try {
      await api.patch(`/lessons/${id}/settings`, body);
      toast.success(message);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  }

  async function toggleFeatured(lesson) {
    const nextFeatured = !lesson.isFeatured;

    await patch(
      lesson._id,
      {
        isFeatured: nextFeatured,
        visibility: nextFeatured ? "Public" : lesson.visibility
      },
      nextFeatured
        ? "Lesson added to Featured section"
        : "Lesson removed from Featured section"
    );
  }

  async function toggleReviewed(lesson) {
    await patch(
      lesson._id,
      { isReviewed: !lesson.isReviewed },
      lesson.isReviewed ? "Marked as not reviewed" : "Marked as reviewed"
    );
  }

  async function deleteLesson(id) {
    const result = await Swal.fire({
      title: "Delete lesson?",
      text: "This will permanently remove the lesson from the platform.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/lessons/${id}`);
      toast.success("Lesson deleted");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  }

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <span className="eyebrow">Admin Moderation</span>
        <h1>Manage Lessons</h1>
        <p className="muted">
          Feature lessons on the homepage, review content, filter lessons, and remove inappropriate posts.
        </p>
      </div>

      <div className="statGrid">
        <div>
          <span>Public</span>
          <strong>{stats.publicCount || 0}</strong>
        </div>

        <div>
          <span>Private</span>
          <strong>{stats.privateCount || 0}</strong>
        </div>

        <div>
          <span>Featured</span>
          <strong>{stats.featuredCount || 0}</strong>
        </div>

        <div>
          <span>Flagged</span>
          <strong>{stats.flaggedCount || 0}</strong>
        </div>
      </div>

      <div className="filtersBar">
        <select
          value={filters.visibility}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, visibility: e.target.value }))
          }
        >
          <option value="">All visibility</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        <select
          value={filters.flags}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, flags: e.target.value }))
          }
        >
          <option value="">All flags</option>
          <option value="true">Flagged only</option>
        </select>
      </div>

      {lessons.length === 0 ? (
        <div className="formCard">
          <h3>No lessons found</h3>
          <p className="muted">
            Add some lessons first, then come back here to mark them as featured.
          </p>
          <Link className="btn primary" to="/dashboard/add-lesson">
            Add Lesson
          </Link>
        </div>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Creator</th>
                <th>Visibility</th>
                <th>Access</th>
                <th>Reports</th>
                <th>Homepage Featured</th>
                <th>Reviewed</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson._id}>
                  <td>
                    <strong>{lesson.title}</strong>
                    <br />
                    <small className="muted">
                      {lesson.category} • {lesson.emotionalTone}
                    </small>
                  </td>

                  <td>{lesson.creatorName || "Unknown"}</td>

                  <td>
                    <span className="badge free">{lesson.visibility}</span>
                  </td>

                  <td>
                    <span className="badge">{lesson.accessLevel}</span>
                  </td>

                  <td>{lesson.reportsCount || 0}</td>

                  <td>
                    <button
                      type="button"
                      className={lesson.isFeatured ? "btn primary small" : "btn ghost small"}
                      onClick={() => toggleFeatured(lesson)}
                    >
                      <Star size={16} />
                      {lesson.isFeatured ? "Featured" : "Add Featured"}
                    </button>

                    {lesson.isFeatured && (
                      <small className="muted" style={{ display: "block", marginTop: "6px" }}>
                        Showing on homepage
                      </small>
                    )}
                  </td>

                  <td>
                    <button
                      type="button"
                      className={lesson.isReviewed ? "btn primary small" : "btn ghost small"}
                      onClick={() => toggleReviewed(lesson)}
                    >
                      <ShieldCheck size={16} />
                      {lesson.isReviewed ? "Reviewed" : "Mark Reviewed"}
                    </button>
                  </td>

                  <td className="rowActions">
                    <Link to={`/lessons/${lesson._id}`}>
                      <Eye size={16} /> Open
                    </Link>

                    <button type="button" onClick={() => deleteLesson(lesson._id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}