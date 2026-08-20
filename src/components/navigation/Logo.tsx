import React from "react"; 
 
const Logo: React.FC = () => { 
    return ( 
        <a 
            href="/" 
            className="logo" 
            aria-label="Teens Connect Africa" 
        > 
            <img 
                src="/logo/bobdaddy 2 1580.jpg" 
                alt="Teens Connect Africa" 
                className="logo-image" 
                style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block"
                }}
            /> 
        </a> 
    ); 
}; 
 
export default Logo;