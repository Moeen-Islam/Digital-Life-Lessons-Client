import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookHeart, Brain, Sparkles, Users, ShieldCheck, Gem } from "lucide-react";
import { api } from "../lib/api";
import LessonCard from "../components/LessonCard";
import SectionTitle from "../components/SectionTitle";
import Loader from "../components/Loader";

const slides = [
  {
    title: "Archive the Wisdom You Forge Through Life",
    text: "A private and public wisdom ledger for lessons, reflections, mistakes learned, and meaningful growth stories.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1800&auto=format&fit=crop"
  },
  {
    title: "Transform Personal Growth Into a Living Library",
    text: "Write, organize, favorite, and revisit the insights that shaped your mindset, career, relationships, and future decisions.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1800&auto=format&fit=crop"
  },
  {
    title: "Unlock Premium Wisdom From the Community",
    text: "Share free or premium lessons, react to meaningful stories, and learn from people who turned experience into clarity.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1800&auto=format&fit=crop"
  }
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [data, setData] = useState({ featured: [], saved: [], contributors: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setSlide((prev) => (prev + 1) % slides.length), 4800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([api.get("/lessons/featured"), api.get("/lessons/most-saved"), api.get("/lessons/top-contributors")])
      .then(([featured, saved, contributors]) => {
        setData({ featured: featured.data.lessons, saved: saved.data.lessons, contributors: contributors.data.contributors });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero" style={{ backgroundImage: `url(${slides[slide].image})` }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72 }} className="heroContent">
            <span className="eyebrow">Unify Your Mindset Journey</span>
            <h1>{slides[slide].title}</h1>
            <p>{slides[slide].text}</p>
            <div className="heroBtns">
              <Link className="btn primary" to="/register">Join the Ledger <ArrowRight size={18} /></Link>
              <Link className="btn ghost" to="/public-lessons">Browse All Wisdom</Link>
            </div>
            <div className="heroMetrics">
              <div className="heroMetric"><strong>Free + Premium</strong><span>Access control for every lesson</span></div>
              <div className="heroMetric"><strong>Likes + Saves</strong><span>Real engagement and favorites</span></div>
              <div className="heroMetric"><strong>Admin Curated</strong><span>Featured lessons from dashboard</span></div>
            </div>
            <div className="slideDots">{slides.map((_, index) => <button key={index} onClick={() => setSlide(index)} className={slide === index ? "active" : ""} aria-label={`Show slide ${index + 1}`} />)}</div>
          </motion.div>
        </div>
      </section>

      <section className="container section">
        <SectionTitle eyebrow="Admin-Curated Wisdoms" title="Featured Life Lessons" text="Hand-selected articles and personal break-through summaries marked for deep introspection by platform administrators." />
        {loading ? <Loader /> : <div className="cardGrid">{data.featured.map((lesson) => <LessonCard key={lesson._id} lesson={lesson} />)}</div>}
      </section>

      <section className="section softBg">
        <div className="container">
          <SectionTitle eyebrow="Why Learning From Life Matters" title="Your Experience Becomes Power When You Preserve It" text="Digital Life Lessons gives your growth a structure: memory, clarity, accountability, and community impact." />
          <div className="benefitGrid">
            {[
              [BookHeart, "Preserve wisdom", "Save lessons from real experiences before they disappear from memory."],
              [Brain, "Improve decisions", "Review patterns from the past to make calmer, clearer choices."],
              [Sparkles, "Build reflection habits", "Create a consistent rhythm of personal growth and gratitude."],
              [Users, "Help the community", "Share hard-earned lessons that may guide someone else today."]
            ].map(([Icon, title, text], index) => (
              <motion.div className="benefitCard" key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section splitSections">
        <div>
          <SectionTitle eyebrow="Dynamic Ranking" title="Top Contributors of the Week" />
          <div className="contributorList">
            {data.contributors.length === 0 && <p className="muted">No weekly contributors yet.</p>}
            {data.contributors.map((person, i) => (
              <div className="contributor" key={person._id}>
                <span className="rank">#{i + 1}</span>
                <img src={person.photoURL || "https://api.dicebear.com/9.x/initials/svg?seed=Top"} alt={person.name} />
                <div><strong>{person.name}</strong><small>{person.total} lessons this week</small></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Community Signals" title="Most Saved Lessons" />
          <div className="miniLessonList">
            {data.saved.length === 0 && <p className="muted">No saved lessons yet.</p>}
            {data.saved.map((lesson) => (
              <Link to={`/lessons/${lesson._id}`} key={lesson._id}>
                <Gem />
                <span>{lesson.title}</span>
                <small>{lesson.favoritesCount || 0} saves</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
