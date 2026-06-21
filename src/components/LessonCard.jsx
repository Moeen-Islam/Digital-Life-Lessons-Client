import { Link } from "react-router-dom";
import { CalendarDays, Lock, Heart, Bookmark, ArrowUpRight } from "lucide-react";

export default function LessonCard({ lesson }) {
  const preview = lesson.description?.slice(0, 135) + (lesson.description?.length > 135 ? "..." : "");
  return (
    <article className={`lessonCard ${lesson.locked ? "locked" : ""}`}>
      <div className="lessonImageWrap">
        {lesson.image ? <img src={lesson.image} alt={lesson.title} /> : <div className="imageFallback">Wisdom</div>}
        <span className={`badge ${lesson.accessLevel === "Premium" ? "premium" : "free"}`}>{lesson.accessLevel}</span>
      </div>
      <div className="lessonCardBody">
        <div className="pillRow">
          <span>{lesson.category}</span>
          <span>{lesson.emotionalTone}</span>
        </div>
        <h3>{lesson.title}</h3>
        <p className={lesson.locked ? "blurredText" : ""}>{lesson.locked ? "Premium Lesson – Upgrade to view this wisdom." : preview}</p>
        <div className="creatorMini">
          <img src={lesson.creatorPhoto || "https://api.dicebear.com/9.x/initials/svg?seed=Life"} alt={lesson.creatorName || "Life Learner"} />
          <div>
            <strong>{lesson.creatorName || "Life Learner"}</strong>
            <small><CalendarDays size={13} /> {new Date(lesson.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
        <div className="cardStats">
          <span><Heart size={15} /> {lesson.likesCount || 0}</span>
          <span><Bookmark size={15} /> {lesson.favoritesCount || 0}</span>
        </div>
        {lesson.locked ? (
          <Link className="btn ghost full" to="/pricing"><Lock size={16} /> Upgrade to Premium</Link>
        ) : (
          <Link className="btn primary full" to={`/lessons/${lesson._id}`}>See Details <ArrowUpRight size={16} /></Link>
        )}
      </div>
    </article>
  );
}
