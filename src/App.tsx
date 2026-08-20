import "./components/navigation/Navbar.css";
import "./components/navigation/MobileMenu.css";

import Navbar from "./components/navigation/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About/About";
import Statistics from "./components/sections/Statistics";
import Programs from "./components/sections/Programs";
import Events from "./components/sections/Events";
import Testimonials from "./components/sections/Testimonials";
import Blog from "./components/sections/Blog";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import Gallery from "./components/sections/Gallery/Gallery";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Statistics />
        <Programs />
        <Events />
        <Testimonials />
        <Blog />
        <Contact />
        <Gallery />
      </main>

      <Footer />
    </>
  );
}

export default App;