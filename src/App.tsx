/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { getGenreList } from "./api/genreListApi";
import "./App.css";
import { BASE_URL } from "./constants/base_urls";
import HorizontalScroll from "./horizontalScroll/HorizontalScroll";
import MoviesList from "./moviesList/MoviesList";
import SearchBox from "./searchBox/SearchBox";
import { moviesListType, dataType } from "./types/moviesListType";
import { API_KEY } from "./constants/API_KEY";
import Logo from "./Logo/Logo";
function App() {
  // const primaryReleaseYear = [2012];
  const [moviesData, setMoviesData] = useState<moviesListType[]>([]); // fetch data
  const [genreList, setGenreList] = useState<Record<string, any>[]>([]); // fetch data
  const [error, setError] = useState<Record<string, boolean>>({
    genreError: false,
    moviesError: false,
  });
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number[]>([1]);
  const [selectedYears, setSelectedYears] = useState([2012]);
  const [scrollDirection, setScrollDirection] = useState<"UP" | "DOWN" | "">(
    ""
  );
  const intialParams = [
    { vote_count_gte: 150 },
    { sort_by: "popularity.desc" },
    { api_key: API_KEY },
  ];
  const initialSelectedGenre = { id: 1, name: "All" };
  const containerRef = useRef<HTMLDivElement>(null);

  // const flagRef = useRef<boolean>(false);
  // const currentScrollPosition = useRef<number>(0);

  async function handleGenreList() {
    try {
      const list = await getGenreList();
      setGenreList([initialSelectedGenre, ...list.genres]);
    } catch {
      setError((err) => ({ ...err, genreError: true }));
    }
  }
  function handleScroll(prop: "UP" | "DOWN") {
    setScrollDirection(prop);
    switch (prop) {
      case "UP":
        setSelectedYears((arr) => [arr[0] - 1, ...arr]);
        break;
      case "DOWN":
        if(selectedYears[selectedYears.length - 1] > new Date().getFullYear()) return;
        setSelectedYears((arr) => [...arr, arr[arr.length - 1] + 1]);
        break;
      default:
        console.log("undefined action");
        setScrollDirection("");
    }
  }
  async function fetchScrollData() {
    let data: dataType;
    try {
      const params = new URLSearchParams();
      intialParams.forEach((each: Record<string, any>) => {
        for (const key in each) params.append(key, each[key]);
      });
      params.append("with_text_query", query);
      params.append(
        "with_genres",
        selectedGenre[0] === 1 && selectedGenre.length === 1
          ? ""
          : selectedGenre.join("|")
      );

      if (scrollDirection === "UP") {
        console.log("when scrolled up",selectedYears);
        params.append("primary_release_year", selectedYears[0].toString());
      } else if (scrollDirection === "DOWN") {
        console.log("when scrolled down",selectedYears);
        params.append(
          "primary_release_year",
          selectedYears[selectedYears.length - 1].toString()
        );
      }
      if (selectedYears[selectedYears.length - 1] > new Date().getFullYear())
        return;
      console.log(params.toString());
      const result = await fetch(`${BASE_URL}?${params}`);
      data = await result.json();
      console.log(data.results);
      if (scrollDirection === "UP") {
        if (data.results.length) setMoviesData((c) => [data.results, ...c]);
        // flagRef.current = false;
        // window.scrollTo(0, currentScrollPosition.current);
      } else if (scrollDirection === "DOWN") {
        if (data.results.length) setMoviesData((c) => [...c, data.results]);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchData() {
    
    let data: dataType;
    try {
      const params = new URLSearchParams();
      intialParams.forEach((each: Record<string, any>) => {
        for (const key in each) params.append(key, each[key]);
      });
      params.append("with_text_query", query);
      params.append("primary_release_year", selectedYears[0].toString());

      params.append(
        "with_genres",
        selectedGenre[0] === 1 && selectedGenre.length === 1
          ? ""
          : selectedGenre.join("|")
      );
      console.log(params.toString());
      const result = await fetch(`${BASE_URL}?${params}`);

      data = await result.json();
      setMoviesData([data.results]);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => { 
    fetchData();
    setSelectedYears([2012]);

  }, [query, selectedGenre]);

  useEffect(() => {
    fetchScrollData();
  }, [selectedYears]);

  useEffect(() => {
    handleGenreList();
    window.addEventListener("scroll", () => {
      //     setScrollPosition(document.body.offsetHeight);
      // const scrollableHeight = document.body.offsetHeight - window.innerHeight;
      // const savedScrollRatio = window.scrollY / scrollableHeight;
      if (window.scrollY <= 0) {
        handleScroll("UP");
        // flagRef.current = true;
        // currentScrollPosition.current = window.scrollY;
        //window.scrollTo(0,scrollPosition)
      } else if (
        window.innerHeight + window.scrollY + 50 >=
        document.body.offsetHeight
      ) {
        handleScroll("DOWN");
      }
      // window.scrollTo(
      //   0,
      //   savedScrollRatio * (document.body.offsetHeight - window.innerHeight)
      // );
    });
  }, []);
  return (
    <div className="App">
      <Logo />
      {!error.genreError ? (
        <HorizontalScroll
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          items={genreList}
        />
      ) : (
        <div>Failed to fetch Genres</div>
      )}
      <SearchBox query={query} setQuery={setQuery} />

      {moviesData.length === 0 ? (
        <div>No Data found</div>
      ) : (
        <div className="movies-container" ref={containerRef}>
          {moviesData.length &&
            moviesData.map((data: Record<string, any>[]) => {
              return data.length ? (
                <MoviesList data={data} />
              ) : (
                <div>Seems we do not have the movie you are searching for</div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default App;
