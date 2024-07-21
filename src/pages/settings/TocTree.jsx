import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faUsers } from '@fortawesome/free-solid-svg-icons';

function TocTree() {
  let links = [
    ["/settings", "overview", <FontAwesomeIcon className="w3-margin-right" icon={faUserCog} />],
    ["/settings/sessions", "sessions", <FontAwesomeIcon className="w3-margin-right" icon={faUsers} />],
  ];
  let selected = (path) => window.location.pathname == path;
  return (
    <nav id="settings-toctree">
      {links.map(([url, title, icon]) => (
        <Link key={url} to={url} className={"button"+(selected(url)?" selected":"")}>
          {icon}<span className="desc">{title}</span>
        </Link>
      ))}
    </nav>
  );
}

export default TocTree;
