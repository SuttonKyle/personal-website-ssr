import Link from "next/link";
import { PageHeader } from "../components/Headers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faFile } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";

const LinksPage = () => <div>
  <PageHeader className="mb-4">Let&apos;s Connect!</PageHeader>
  <div className="flex items-center mb-4"><FontAwesomeIcon className="icon" icon={faPhone} />+1 339.236.0329</div>
  <div><Link href="mailto:suttonkylec@gmail.com" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faEnvelope} />suttonkylec@gmail.com</Link></div>
  <div><Link href="https://s3.amazonaws.com/kylesutton-personal-website-photos/documents%2FRESUME_KYLE_SUTTON.pdf" target="_blank" className="flex items-center contact-link" download><FontAwesomeIcon className="icon" icon={faFile} />Resume</Link></div>
  <div><Link href="https://linkedin.com/in/kylesutton" target="_blank" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faLinkedin} />LinkedIn</Link></div>
  <div><Link href="https://github.com/SuttonKyle" target="_blank" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faGithub} />GitHub</Link></div>
  <div><Link href="https://www.npmjs.com/~kylesutton" target="_blank" className="flex items-center contact-link"><FontAwesomeIcon className="icon" icon={faNpm} />npm</Link></div>
</div>;
export default LinksPage;