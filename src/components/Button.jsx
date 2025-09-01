import React from "react";
import { Link } from "react-router-dom";

function Button({ text, link, btnBg, arrowBg }) {
  return (
    <Link
      to={link}
      target="_blank"
      className={`btn flex justify-between items-center rounded-full p-1  ${btnBg}`}
    >
      <div className={`btn-arrow rounded-full text-center ${arrowBg}`}>
        <i class="far fa-long-arrow-right"></i>
      </div>
      <div className={`btn-text font-h  px-4 body-t`}>{text}</div>
    </Link>
  );
}

export default Button;
