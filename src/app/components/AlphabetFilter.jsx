import { useState } from "react";

export default function AlphabetFilter({ onFilter }) {
  const alphabet = "ABDFGHIJKLMNPRSTUVZ".split("");
  const [activeLetter, setActiveLetter] = useState("ALL");

  const handleFilter = (letter) => {
    setActiveLetter(letter);
    onFilter(letter);
  };

  return (
    <div className="flex flex-wrap md:justify-between space-x-6 mb-6 text-lg font-light">
      <button
        onClick={() => handleFilter("ALL")}
        className={`${
          activeLetter === "ALL" ? "text-black font-medium font-barlow" : "text-[#8A8A8A] font-medium font-barlow"
        } hover:text-black`}
      >
        ALL
      </button>
      {alphabet.map((letter) => (
        <button
          key={letter}
          onClick={() => handleFilter(letter)}
          className={`${
            activeLetter === letter ? "text-black font-medium font-barlow" : "text-[#8A8A8A] font-medium font-barlow"
          } hover:text-black`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
