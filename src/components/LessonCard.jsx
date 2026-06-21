import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Heart,
  LockKeyhole,
} from "lucide-react";

function fallbackAvatar(seed = "User") {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    seed
  )}`;
}

function formatDate(date) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LessonCard({ lesson }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const title = lesson?.title || "Untitled Lesson";
  const category = lesson?.category || "Personal Growth";
  const tone = lesson?.emotionalTone || "Motivational";
  const creatorName = lesson?.creatorName || "Unknown Author";
  const accessLevel = lesson?.accessLevel || "Free";

  const hasImage = lesson?.image && !imageFailed;

  const creatorPhoto =
    !avatarFailed && lesson?.creatorPhoto
      ? lesson.creatorPhoto
      : fallbackAvatar(creatorName);

  return (
    <article className={`lessonCard ${lesson?.locked ? "locked" : ""}`}>
      <div className="lessonImageWrap">
        {hasImage ? (
          <img
            src={lesson.image}
            alt={title}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="imageFallback modernFallback">
            <span>{category}</span>
            <strong>{title.charAt(0).toUpperCase()}</strong>
          </div>
        )}

        <span className={`badge ${accessLevel === "Free" ? "free" : ""}`}>
          {accessLevel === "Premium" ? "Premium" : "Free"}
        </span>

        {lesson?.locked && (
          <div className="premiumOverlay">
            <LockKeyhole size={28} />
            <small>Premium locked</small>
          </div>
        )}
      </div>

      <div className="lessonCardBody">
        <div className="pillRow">
          <span>{category}</span>
          <span>{tone}</span>
        </div>

        <h3 className="lessonTitleClamp">{title}</h3>

        <p className={lesson?.locked ? "blurredText lessonDescClamp" : "lessonDescClamp"}>
          {lesson?.description ||
            "A meaningful reflection waiting to be explored."}
        </p>

        <div className="creatorMini">
          <img
            src={creatorPhoto}
            alt={creatorName}
            onError={() => setAvatarFailed(true)}
          />

          <div>
            <strong>{creatorName}</strong>
            <small>
              <CalendarDays size={13} />
              {formatDate(lesson?.createdAt)}
            </small>
          </div>
        </div>

        <div className="cardStats">
          <span>
            <Heart size={15} /> {lesson?.likesCount || 0}
          </span>

          <span>
            <Bookmark size={15} /> {lesson?.favoritesCount || 0}
          </span>
        </div>

        <Link className="btn primary full cardBtn" to={`/lessons/${lesson?._id}`}>
          See Details <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}