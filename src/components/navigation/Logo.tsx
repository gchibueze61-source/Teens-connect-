
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <>
      <style>{`
        .logo {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
          text-decoration: none;
          background: #FFFFFF;
          line-height: 0;
        }

        .logo-image {
          display: block;
          width: auto;
          height: 48px;
          max-width: 100%;
          object-fit: contain;
          object-position: center;
          background: #FFFFFF;
        }

        .logo:focus-visible {
          outline: 2px solid #0D1B5E;
          outline-offset: 4px;
          border-radius: 3px;
        }

        @media (max-width: 480px) {
          .logo-image {
            height: 40px;
          }
        }
      `}</style>

      <Link
        to="/"
        className="logo"
        aria-label="Teens Connect Africa home"
      >
        <img
          src="/src/components/navigation/teens_connect_africa_logo_cropped.png"
          alt="Teens Connect Africa"
          className="logo-image"
        />
      </Link>
    </>
  );
};

export default Logo;
