import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../lib/api";
import LessonCard from "../components/LessonCard";
import SectionTitle from "../components/SectionTitle";
import Loader from "../components/Loader";

export default function PublicLessons() {
  const [lessons, setLessons] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    pages: 1,
    categories: [],
    tones: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tone: "",
    sort: "newest",
    page: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/lessons/public", { params: filters })
      .then(({ data }) => {
        setLessons(data.lessons);
        setMeta(data);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  function change(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  }

  return (
    <section className="container section">
      <SectionTitle
        eyebrow="Community Wisdom"
        title="Browse Public Life Lessons"
        text="Search, filter, sort, and explore lessons shared by the community."
      />
      <div className="filtersBar">
        <label className="searchBox">
          <Search size={18} />
          <input
            placeholder="Search title or keyword"
            value={filters.search}
            onChange={(e) => change("search", e.target.value)}
          />
        </label>
        <select
          value={filters.category}
          onChange={(e) => change("category", e.target.value)}
        >
          <option value="">All categories</option>
          {meta.categories?.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.tone}
          onChange={(e) => change("tone", e.target.value)}
        >
          <option value="">All tones</option>
          {meta.tones?.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => change("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="most-saved">Most Saved</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="cardGrid">
          {lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          disabled={filters.page <= 1}
          onClick={() => change("page", filters.page - 1)}
        >
          Prev
        </button>
        <span>
          Page {meta.page} of {Math.max(meta.pages, 1)}
        </span>
        <button
          disabled={filters.page >= meta.pages}
          onClick={() => change("page", filters.page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
