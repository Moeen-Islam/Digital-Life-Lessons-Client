import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

function BrandLogo() {
  return (
    <Link to="/" className="logo" aria-label="Digital Life Lessons home">
      <span className="logoMark">Ω</span>
      <span className="logoText">
        Digital Life Lessons
        <small>Wisdom Ledger</small>
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <BrandLogo />
        <p>Archive the wisdom you forge through life, reflect on growth, and learn from meaningful public lessons.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>moeenislam8089@gmail.com</p>
        <p>+880 1303 218089</p>
        <p>Dhaka, Bangladesh</p>
      </div>
      <div>
        <h4>Legal</h4>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
      <div>
        <h4>Social</h4>
        <div className="socials">
          <a href="https://facebook.com" aria-label="Facebook"><Facebook /></a>
          <a href="https://x.com" aria-label="X" className="xLogo">𝕏</a>
          <a href="https://instagram.com" aria-label="Instagram"><Instagram /></a>
          <a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin /></a>
        </div>
      </div>
    </footer>
  );
}
