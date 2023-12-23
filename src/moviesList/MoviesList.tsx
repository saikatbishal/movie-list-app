import MovieCard from "../movieCard/MovieCard";

type movieListPropType = {
  releaseYear: number;
  data: Record<string, any>[];
};
const MoviesList = (props: movieListPropType) => {
  const { releaseYear, data } = props;
  return (
    <div className="movie-list__parent">
      <p>{releaseYear}</p>
      <div className="movie-list">
        {data.map((item: Record<string, any>) => {
          return <MovieCard {...item} />;
        })}
      </div>
    </div>
  );
};

export default MoviesList;
