import React from "react";
import MovieCard from "../movieCard/MovieCard";
import './movieList.css'
type movieListPropType = {
  data: Record<string, any>[];
};
const MoviesList = React.forwardRef<HTMLDivElement, movieListPropType>((props: movieListPropType) => {
  const { data } = props;
  // const yearOfRelease = data[0].release_date.slice(0,4);
  return (
    <div className="movie-list__parent">
      {/* <p>{yearOfRelease}</p> */}
      <div className="movie-list">
        {data.map((item: Record<string, any>) => {
          return <MovieCard {...item} />;
        })}
      </div>
    </div>
  );
});

export default MoviesList;
