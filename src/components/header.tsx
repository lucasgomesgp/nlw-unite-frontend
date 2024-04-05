import { NavLink } from "./nav-link";
import nlwUniteIcon from "../assets/nlw-unite-icon.svg";

export function Header() {
    return (
        <div className="flex items-center gap-5 py-2">
            <img src={nlwUniteIcon} />
            <nav className="flex items-center gap-5">
                <NavLink href="#">Eventos</NavLink>
                <NavLink href="#">Participantes</NavLink>
            </nav>
        </div>
    );
}
