import "./components/navigation/Navbar.css";
import "./components/navigation/MobileMenu.css";

import Navbar from "./components/navigation/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About/About";
import Statistics from "./components/sections/Statistics";
import Programs from "./components/sections/Programs";
import Events from "./components/sections/Events";
import AICoach from "./components/sections/AICoach";
import Testimonials from "./components/sections/Testimonials";
import Blog from "./components/sections/Blog";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Statistics />
      <Programs />
      <Events />
      <AICoach/>
      <Testimonials />
      <Blog />  
    </>
  );
}

export default App;