/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { getGenreList } from "./api/genreListApi";
import "./App.css";
import { BASE_URL } from "./constants/base_urls";
import HorizontalScroll from "./horizontalScroll/HorizontalScroll";
import MoviesList from "./moviesList/MoviesList";
import SearchBox from "./searchBox/SearchBox";
import { moviesListType, dataType } from "./types/moviesListType";
function App() {
  const [moviesData, setMoviesData] = useState<moviesListType>([]);
  // to store the data
  const [movieReleaseYears, setMovieReleaseYears] = useState<number[]>([2012]);
  // fetch the movies data if this state changes, also keep track of the years whose best 20 movies have been fetched
  const [selectedGenre, setSelectedGenre] = useState<number>(1);
  // for selecting genre and fetching the desired data
  const [genreList, setGenreList] = useState<any[]>([]);
  // for fetching the list of genre (all functionality done)
  const [isLastYear, setIsLastYear] = useState<null | boolean>(null);
  // for choosing how to mutate the movies data after fetching
  const initialSelectedGenre = { id: 1, name: "All" };
  const containerRef = useRef<HTMLDivElement>(null);


  async function handleGenreList() {
    const list = await getGenreList();
    setGenreList([initialSelectedGenre, ...list.genres]);
  }
  function handleUp() {
    setIsLastYear(false);
    const prevReleaseYear = movieReleaseYears[0] - 1;
    setMovieReleaseYears((originalYearArray) => [
      prevReleaseYear,
      ...originalYearArray,
    ]);
  }
  function handleDown() {
    setIsLastYear(true);
    const nextReleaseYear = movieReleaseYears[movieReleaseYears.length - 1] + 1;
    setMovieReleaseYears((originalYearArray) => [
      ...originalYearArray,
      nextReleaseYear,
    ]);
  }

  async function fetchData(newYear: number) {
    let data: dataType;
    try {
      const result = await fetch(`${BASE_URL}&primary_release_year=${newYear}`);
      data = await result.json();
      if (isLastYear) {
        setMoviesData((c: any) => [...c, data.results]);
      } else {
        setMoviesData((c: any) => [data.results, ...c]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isLastYear) {
      fetchData(movieReleaseYears[movieReleaseYears.length - 1]);
    } else {
      fetchData(movieReleaseYears[0]);
    }
  }, [movieReleaseYears,isLastYear]);

  useEffect(() => {
    handleGenreList();
  }, []);
  return (
    <div className="App">
      <HorizontalScroll
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        items={genreList}
      />
      <SearchBox />
      <button onClick={() => handleUp()}>Up</button>
      <div className="movies-container" ref={containerRef}>
        {moviesData.map((data: any) => {
        return <MoviesList data={data} />;
      })}
      </div>
      

      <button onClick={() => handleDown()}>Down</button>
    </div>
  );
}

export default App;

// if 'UP' is clicked                                           if 'DOWN' is clicked
/**
 * 1. unshift the array enter firstInteger-1 to the 0th index     1. push lastInteger + 1 to the nth index
 * 2. fetch for 0th index                                         2. fetch for the nth index
 * 3. setData([newData,...initialData])                           3. setData([...initialData, newData])
 *
 * 
 * this should be changed to lazy loading (infinite scrolling)
 */
