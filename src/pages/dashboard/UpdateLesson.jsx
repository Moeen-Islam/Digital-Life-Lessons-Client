import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";
import LessonForm from "./LessonForm";

export default function UpdateLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  useEffect(() => { api.get(`/lessons/${id}`).then(({ data }) => setLesson(data.lesson)); }, [id]);
  if (!lesson) return <Loader text="Loading lesson for update..." />;
  return <div><h1>Update Lesson</h1><LessonForm mode="update" initial={lesson} /></div>;
}
