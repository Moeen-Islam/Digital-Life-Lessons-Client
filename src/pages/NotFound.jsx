import { Link } from "react-router-dom";

export default function NotFound() {
  return <section className="notFound"><h1>404</h1><h2>Page not found</h2><p>The page you are looking for does not exist or was moved.</p><Link className="btn primary" to="/">Back Home</Link></section>;
}
