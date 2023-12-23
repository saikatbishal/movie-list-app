import React from "react";
import "./horizontalScroll.css";
interface HorizontalScrollProps {
  items: Record<string, any>[];
  selectedGenre: null | number;
  setSelectedGenre: React.Dispatch<React.SetStateAction<number>>;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  items,
  selectedGenre,
  setSelectedGenre,
}: HorizontalScrollProps) => {
  return (
    <div className="horizontal-scroll">
      {items.map((item) => (
        <button
          className={`scroll-button ${
            selectedGenre === item.id ? "selected-button" : ""
          }`}
          onClick={() => setSelectedGenre(item.id)}
          key={item.id}
          style={{ margin: "5px", padding: "10px" }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default HorizontalScroll;
