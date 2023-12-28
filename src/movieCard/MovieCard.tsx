import { useState } from "react";
import { IMAGE_BASE_URL } from "../constants/base_urls";
import "./movieCard.css";
const MovieCard = ({
  title,
  poster_path,
  release_date,
  overview,
  backdrop_path,
  vote_average,
  vote_count,
}: any) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  /**
   * movie title, image, genre, cast, director, and a short description
   */
  return (
    <div
      className="card-parent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="menuitem"
    >
      <img
        src={`${IMAGE_BASE_URL}${poster_path}`}
        alt={title}
      />

      <div className={`title-card`}>
        <div>
          <h3>{title}</h3>
          <p>{release_date}</p>
          <p>Rating: {vote_average}</p>
        </div>
      </div>

      {isHovered && (
        <div className="title-card full">
            <h4>Description:</h4>
            <p>{overview}</p>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
