import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons/faNpm";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const Footer = () => <div className="flex flex-row">
  <Link href="mailto:suttonkylec@gmail.com" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faEnvelope} /></Link>
  <Link href="https://linkedin.com/in/kylesutton" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faLinkedin} /></Link>
  <Link href="https://github.com/SuttonKyle" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faGithub} /></Link>
  <Link href="https://www.npmjs.com/~kylesutton" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faNpm} /></Link>
</div >