import { useState } from "react";
import { IMAGE_BASE_URL } from "../constants/base_urls";
import "./movieCard.css";
import { MovieCardType } from "../types/movieCardType";
const MovieCard = ({
  key,
  title,
  poster_path,
  release_date,
  overview,
  vote_average,
}: MovieCardType) => {
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
        <div className="description-card">
            <h4>Description:</h4>
            <p>{overview.slice(0,200)}...</p>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
