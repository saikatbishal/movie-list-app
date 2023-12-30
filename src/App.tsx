/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { getGenreList } from "./api/genreListApi";
import "./App.css";
import { BASE_URL } from "./constants/base_urls";
import HorizontalScroll from "./horizontalScroll/HorizontalScroll";
import MoviesList from "./moviesList/MoviesList";
import SearchBox from "./searchBox/SearchBox";
import { moviesListType, dataType } from "./types/moviesListType";
import Logo from "./Logo/Logo";

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [moviesData, setMoviesData] = useState<moviesListType[]>([]); // fetch data
  const [genreList, setGenreList] = useState<Record<string, any>[]>([]); // fetch data
  const [error, setError] = useState<Record<string, boolean>>({
    genreError: false,
    moviesError: false,
  });
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number[]>([1]);
  const [selectedYears, setSelectedYears] = useState([2012]);
  const [scrollDirection, setScrollDirection] = useState<"UP" | "DOWN" | "">(
    ""
  );
  const [endOfList, setEndofList] = useState(false);
  const intialParams = [
    { vote_count_gte: 150 },
    { sort_by: "popularity.desc" },
    { api_key: API_KEY },
  ];
  const initialSelectedGenre = { id: 1, name: "All" };
  const containerRef = useRef<HTMLDivElement>(null);

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
        params.append("primary_release_year", selectedYears[0].toString());
      } else if (scrollDirection === "DOWN") {
        params.append(
          "primary_release_year",
          selectedYears[selectedYears.length - 1].toString()
        );
      }
      if (selectedYears[selectedYears.length - 1] > new Date().getFullYear()) {
        setEndofList(true);
        return;
      }
      const result = await fetch(`${BASE_URL}?${params}`);
      data = await result.json();
      if (scrollDirection === "UP") {
        if (data.results.length) {
          setMoviesData((c) => [data.results, ...c]);
          window.scrollTo(0, 500);
        }
      } else if (scrollDirection === "DOWN") {
        if (data.results.length) setMoviesData((c) => [...c, data.results]);
      }
    } catch (err) {
      setError((err) => ({ ...err, moviesError: true }));
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
      if (query.length === 0) params.append("primary_release_year", "2012");

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
  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  useEffect(() => {
    setSelectedYears([2012]);
    fetchData();
  }, [debouncedQuery, selectedGenre]);

  useEffect(() => {
    fetchScrollData();
  }, [selectedYears]);

  useEffect(() => {
    handleGenreList();
    window.addEventListener("scroll", () => {
      if (window.scrollY <= 0) {
        handleScroll("UP");
      } else if (
        window.innerHeight + window.scrollY + 2 >=
        document.body.offsetHeight
      ) {
        handleScroll("DOWN");
      }
    });
  }, []);
  return (
    <div className={`App ${scrollDirection === "UP" ? "scroll-up" : ""}`}>
      <header className="header">
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
      </header>
      <body className="body">
        {moviesData.length === 0 ? (
          <div>Oops! Seems like you're out of luck.</div>
        ) : (
          <div className="movies-container" ref={containerRef}>
            {moviesData.map((data: Record<string, any>[]) => {
              return data.length ? (
                <MoviesList data={data} />
              ) : (
                <div>Seems we do not have the movie you are searching for</div>
              );
            })}
          </div>
        )}
      </body>
      {endOfList && (
        <footer className="footer">
          <h1>There's always a next year</h1>
        </footer>
      )}
    </div>
  );
}

export default App;
