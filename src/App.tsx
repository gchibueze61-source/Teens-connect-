import "./components/navigation/Navbar.css";
import "./components/navigation/MobileMenu.css";

import Navbar from "./components/navigation/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <main
        style={{
          height: "200vh",
          padding: "40px",
          background: "#f8fafc"
        }}
      >
        <h1>Teens Connect Africa</h1>

        <p>
          Homepage coming soon...
        </p>
      </main>
    </>
  );
}

export default App;