import React from "react";
import "./horizontalScroll.css";
interface HorizontalScrollProps {
  items: Record<string, any>[];
  selectedGenre: number[];
  setSelectedGenre: React.Dispatch<React.SetStateAction<number[]>>;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  items,
  selectedGenre,
  setSelectedGenre,
}: HorizontalScrollProps) => {
   const handleClick = (id:number)=>{
    if (selectedGenre.includes(1) && id !== 1) {
      const indexOfOne = selectedGenre.indexOf(1);
      const newArray = [...selectedGenre]; // copying to the newArray
      newArray.splice(indexOfOne, 1); // removing 1 from the newArray
      newArray.push(id); // adding button clicked id into the newArray
      setSelectedGenre(newArray); // mutating the state with the newArray
    }
    // case 2 : all is not in the Array and user selects multiple genres
    else if (id !== 1) {
      //case 2.0: 
      if (selectedGenre.includes(id)) {
        const newArray = [...selectedGenre];
        newArray.splice(newArray.indexOf(id), 1);
        // case 2.0.0
        if(newArray.length)
          setSelectedGenre(newArray);
        else{
        // case 2.0.1: if the user unselects everything -- select All(1)
          setSelectedGenre([1])
        }
      } else {
        // case 2.1: if the user selects some genre
        setSelectedGenre((old) => [...old, id]);
      }
    }
    // case 3: all is not in the array and use selects all button
    else if (id === 1 && !selectedGenre.includes(1)) {
      setSelectedGenre([1]);
    }
   }  
  return (
    <div className="horizontal-scroll">
      {items.map((item) => (
        <button
          className={`scroll-button ${
            selectedGenre.includes(item.id) ? "selected-button" : ""
          }`}
          onClick={() => handleClick(item.id)}
          key={item.id}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default HorizontalScroll;
