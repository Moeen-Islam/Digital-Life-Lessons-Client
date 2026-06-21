export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loaderWrap">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
