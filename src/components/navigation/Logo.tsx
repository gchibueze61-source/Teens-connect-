import { Link } from "react-router-dom";
import logoImage from "./teens_connect_africa_logo_cropped.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="logo"
      aria-label="Teens Connect Africa home"
    >
      <img
        src={logoImage}
        alt="Teens Connect Africa"
        className="logo-image"
        width={190}
        height={64}
      />
    </Link>
  );
};

export default Logo;
