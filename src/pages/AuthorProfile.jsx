import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import Loader from "../components/Loader";
import LessonCard from "../components/LessonCard";

export default function AuthorProfile() {
  const { authId } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/users/profile/${authId}`).then(({ data }) => setData(data)); }, [authId]);
  if (!data) return <Loader />;
  return <section className="container section"><div className="profileCard"><img src={data.user.photoURL || "https://api.dicebear.com/9.x/initials/svg?seed=Author"} /><div><h1>{data.user.name}</h1><p>{data.lessons.length} public lessons</p></div></div><div className="cardGrid">{data.lessons.map((lesson) => <LessonCard key={lesson._id} lesson={lesson} />)}</div></section>;
}
