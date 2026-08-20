import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./Hero.css"; 
 
import hero1 from "./bobdaddy 2 1626.jpg"; 
import hero2 from "./bobdaddy 2 1399.JPG"; 
import hero3 from "./bobdaddy 2 1363.JPG"; 
import hero4 from "./bobdaddy 2 1315.JPG"; 
import hero5 from "./2-4 (1).jpg"; 
 
const heroImages = [ 
  hero1, 
  hero2, 
  hero3, 
  hero4, 
  hero5, 
]; 
 
const Hero = () => { 
  const navigate = useNavigate(); 
 
  const [currentImage, setCurrentImage] = useState(0); 

  const [stats, setStats] = useState({
    members: 0,
    countries: 0,
    projects: 0,
    events: 0,
  });
 
  useEffect(() => { 
    const timer = setInterval(() => { 
      setCurrentImage((previous) => { 
        return (previous + 1) % heroImages.length; 
      }); 
    }, 5000); 
 
    return () => clearInterval(timer); 
  }, []); 

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();

    const animateStats = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easeOut = 1 - Math.pow(1 - progress, 3);

      setStats({
        members: Math.floor(500 * easeOut),
        countries: Math.floor(1 * easeOut),
        projects: Math.floor(10 * easeOut),
        events: Math.floor(50 * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animateStats);
      }
    };

    requestAnimationFrame(animateStats);
  }, []);
 
  const scrollToPrograms = () => { 
    const programsSection = 
      document.getElementById("programs"); 
 
    if (programsSection) { 
      programsSection.scrollIntoView({ 
        behavior: "smooth", 
        block: "start", 
      }); 
    } 
  }; 
 
  return ( 
    <section className="hero" id="home"> 
 
      <div className="hero-background"> 
        {heroImages.map((image, index) => ( 
          <div 
            key={index} 
            className={`hero-slide ${ 
              index === currentImage ? "active" : "" 
            }`} 
            style={{ 
              backgroundImage: `url("${image}")`, 
            }} 
          /> 
        ))} 
      </div> 
 
      <div className="hero-overlay"> 
 
        <div className="hero-content"> 
 
          <span className="hero-tag"> 
            An Africa where teenagers have access to mentorship, 
            resources and opportunities to develop their talent and 
            become productive members of society contributing to the 
            global goals and driving sustainable development. 
          </span> 
 
          <h1> 
            Empowering teenagers from Africa's 
            <span> Most underserved communities</span> 
          </h1> 
 
          <p> 
            Mentorship and Support, Strategic Guidance, Partnerships, 
            Entrepreneurship and Digital Skills while connecting with 
            teenagers across Africa. 
          </p> 
 
          <div className="hero-buttons"> 
 
            <button 
              type="button" 
              className="primary-btn" 
              onClick={() => navigate("/register")} 
            > 
              Join Community 
            </button> 
 
            <button 
              type="button" 
              className="secondary-btn" 
              onClick={scrollToPrograms} 
            > 
              Explore Programs 
            </button> 
 
          </div> 
 
          <div className="hero-stats"> 
 
            <div className="stat"> 
              <h2>{stats.members}+</h2> 
              <span>Teen Members</span> 
            </div> 
 
            <div className="stat"> 
              <h2>{stats.countries}</h2> 
              <span>African Country</span> 
            </div> 
 
            <div className="stat"> 
              <h2>{stats.projects}+</h2> 
              <span>Projects Achievement</span> 
            </div> 
 
            <div className="stat"> 
              <h2>{stats.events}+</h2> 
              <span>Events Hosted</span> 
            </div> 
 
          </div> 
 
        </div> 
 
      </div> 
 
      <div className="hero-indicators"> 
 
        {heroImages.map((_, index) => ( 
          <button 
            key={index} 
            type="button" 
            className={`hero-indicator ${ 
              index === currentImage ? "active" : "" 
            }`} 
            onClick={() => setCurrentImage(index)} 
            aria-label={`Show hero image ${index + 1}`} 
          /> 
        ))} 
 
      </div> 
 
    </section> 
  ); 
}; 
 
export default Hero;