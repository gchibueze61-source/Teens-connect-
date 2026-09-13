import "./components/navigation/Navbar.css";
import "./components/navigation/MobileMenu.css";

import Navbar from "./components/navigation/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About/About";
import Programs from "./components/sections/Programs";
import Events from "./components/sections/Events/Events";
import Blog from "./components/sections/Blog/Blog";
import Testimonials from "./components/sections/Testimonials/Testimonials";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Programs />
        <Events />
        <Testimonials />
        <Blog />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;