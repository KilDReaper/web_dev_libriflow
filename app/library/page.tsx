export default function LibraryPage() {
  return (
    <div>
      <h2>Library</h2>

      <div style={item}>📘 Clean Architecture</div>
      <div style={item}>📕 Flutter Development</div>
      <div style={item}>📗 Node.js APIs</div>
    </div>
  );
}

const item = {
  background: "white",
  padding: 16,
  marginBottom: 10,
  borderRadius: 6,
};
