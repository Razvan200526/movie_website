export default function Search({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string | null;
  setSearchTerm: (value: string) => void;
}) {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="Search Icon" className="search-icon" />
        <input
          type="text"
          placeholder="Search through movies"
          value={searchTerm || ""}
          onChange={(event) => setSearchTerm(event.target.value)}
        ></input>
      </div>
    </div>
  );
}
