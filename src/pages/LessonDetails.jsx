import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  CalendarDays,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Share2,
  FileDown,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
// import html2pdf from "html2pdf.js";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { api, SITE_URL } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import LessonCard from "../components/LessonCard";

function fallbackAvatar(seed = "Author") {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    seed,
  )}`;
}

export default function LessonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPremium, user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const contentRef = useRef(null);

  async function load() {
    setLoading(true);

    try {
      const { data } = await api.get(`/lessons/${id}`);

      setLesson(data.lesson);
      setComments(data.comments || []);
      setSimilar(data.similar || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.friendlyMessage ||
          "Failed to load lesson",
      );
      navigate("/public-lessons");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleLike() {
    try {
      const { data } = await api.post(`/lessons/${id}/like`);

      setLesson((prev) => ({
        ...prev,
        likesCount: data.likesCount,
        isLiked: data.liked,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update like");
    }
  }

  async function toggleFavorite() {
    try {
      const { data } = await api.post(`/lessons/${id}/favorite`);

      toast.success(data.message);

      setLesson((prev) => ({
        ...prev,
        favoritesCount: Math.max(
          (prev.favoritesCount || 0) + (data.saved ? 1 : -1),
          0,
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update favorite");
    }
  }

  async function postComment(e) {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Please write a comment first");
      return;
    }

    try {
      const { data } = await api.post(`/lessons/${id}/comments`, {
        text: text.trim(),
      });

      setComments((prev) => [data.comment, ...prev]);
      setText("");
      toast.success("Comment posted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  }

  async function reportLesson() {
    const result = await Swal.fire({
      title: "Report lesson",
      input: "select",
      inputOptions: {
        "Inappropriate content": "Inappropriate content",
        "Spam or misleading": "Spam or misleading",
        "Harassment or hate": "Harassment or hate",
        Other: "Other",
      },
      inputPlaceholder: "Select reason",
      showCancelButton: true,
      confirmButtonText: "Submit report",
    });

    if (!result.isConfirmed) return;

    try {
      await api.post(`/lessons/${id}/report`, {
        reason: result.value || "Other",
      });

      toast.success("Report submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    }
  }

  async function exportPdf() {
    if (!contentRef.current || !lesson) return;

    try {
      toast.loading("Preparing PDF...", { id: "pdf-export" });

      const module = await import("html2pdf.js");
      const html2pdf = module.default;

      await html2pdf()
        .from(contentRef.current)
        .set({
          filename: `${lesson.title || "life-lesson"}.pdf`,
          margin: 0.5,
        })
        .save();

      toast.success("PDF exported successfully", { id: "pdf-export" });
    } catch (error) {
      toast.error("Failed to export PDF", { id: "pdf-export" });
    }
  }

  if (loading) return <Loader text="Loading lesson details..." />;

  if (!lesson) return null;

  const shareUrl = `${SITE_URL}/lessons/${lesson._id}`;

  const authorName =
    lesson.creatorName || lesson.author?.name || "Unknown Author";

  const authorPhoto =
    lesson.creatorPhoto || lesson.author?.photo || fallbackAvatar(authorName);

  const totalLessonsCreated =
    lesson.authorTotalLessons || lesson.author?.totalLessonsCreated || 0;

  if (lesson.locked && !isPremium) {
    return (
      <section className="container section lockedDetail">
        <h1>{lesson.title}</h1>

        <p>
          This is a Premium lesson. Upgrade to Premium to unlock the full story,
          comments, and recommendations.
        </p>

        <div className="blurPanel">{lesson.description}</div>

        <Link className="btn primary" to="/pricing">
          Upgrade to Premium
        </Link>
      </section>
    );
  }

  return (
    <section className="container section detailPage">
      <article className="detailArticle" ref={contentRef}>
        {lesson.image && (
          <img
            className="detailHero"
            src={lesson.image}
            alt={lesson.title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        <div className="pillRow">
          <span>{lesson.category}</span>
          <span>{lesson.emotionalTone}</span>
          <span>{lesson.accessLevel}</span>
        </div>

        <h1>{lesson.title}</h1>

        <p className="storyText">{lesson.description}</p>

        <div className="metadataGrid">
          <span>
            <CalendarDays /> Created{" "}
            {new Date(lesson.createdAt).toLocaleDateString()}
          </span>

          <span>
            <CalendarDays /> Updated{" "}
            {new Date(lesson.updatedAt).toLocaleDateString()}
          </span>

          <span>Visibility: {lesson.visibility}</span>

          <span>{lesson.readingTime || 1} min read</span>
        </div>
      </article>

      <aside className="authorCard">
        <img
          src={authorPhoto}
          alt={authorName}
          onError={(e) => {
            e.currentTarget.src = fallbackAvatar(authorName);
          }}
        />

        <span className="eyebrow">Author / Creator</span>

        <h3>{authorName}</h3>

        <p>Creator of meaningful life lessons.</p>

        <div className="metadataGrid" style={{ margin: "14px 0" }}>
          <span>
            <BookOpen /> Total Lessons Created:{" "}
            <strong>{totalLessonsCreated}</strong>
          </span>
        </div>

        <Link className="btn ghost full" to={`/profile/${lesson.creatorId}`}>
          View all lessons by this author
        </Link>
      </aside>

      <div className="engagementBar">
        <span>
          <Heart /> {lesson.likesCount || 0} Likes
        </span>

        <span>
          <Bookmark /> {lesson.favoritesCount || 0} Favorites
        </span>

        <span>
          <Eye /> {lesson.views || 0} Views
        </span>
      </div>

      <div className="actionRow">
        <button className="btn ghost" onClick={toggleFavorite}>
          <Bookmark size={18} /> Save to Favorites
        </button>

        <button className="btn ghost" onClick={toggleLike}>
          <Heart size={18} /> {lesson.isLiked ? "Unlike" : "Like"}
        </button>

        <button className="btn ghost" onClick={reportLesson}>
          <Flag size={18} /> Report Lesson
        </button>

        <button className="btn ghost" onClick={exportPdf}>
          <FileDown size={18} /> Export PDF
        </button>

        <div className="shareCluster">
          <Share2 size={18} />
          <FacebookShareButton url={shareUrl}>Facebook</FacebookShareButton>
          <TwitterShareButton url={shareUrl}>X</TwitterShareButton>
          <LinkedinShareButton url={shareUrl}>LinkedIn</LinkedinShareButton>
        </div>
      </div>

      <section className="commentsBox">
        <h2>
          <MessageCircle /> Comments
        </h2>

        <form onSubmit={postComment} className="commentForm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write a thoughtful comment as ${user?.name || "you"}`}
            required
          />

          <button className="btn primary">Post Comment</button>
        </form>

        {comments.length === 0 && (
          <p className="muted">No comments yet. Be the first to comment.</p>
        )}

        {comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <img
              src={
                comment.userPhoto ||
                fallbackAvatar(comment.userName || "Comment")
              }
              alt={comment.userName || "Comment user"}
              onError={(e) => {
                e.currentTarget.src = fallbackAvatar(
                  comment.userName || "Comment",
                );
              }}
            />

            <div>
              <strong>{comment.userName}</strong>
              <p>{comment.text}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </section>

      {similar.length > 0 && (
        <section className="similarLessonsSection">
          <h2>Similar & Recommended Lessons</h2>

          <div className="cardGrid">
            {similar.map((item) => (
              <LessonCard key={item._id} lesson={item} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
