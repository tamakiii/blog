import { Link } from "react-router-dom";

interface TagLinkProps {
  tag: string;
}

export default function TagLink({ tag }: TagLinkProps) {
  return (
    <Link to={`/tags/${encodeURIComponent(tag)}`} className="tag">
      {tag}
    </Link>
  );
}
