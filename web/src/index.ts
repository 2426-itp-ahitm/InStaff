import "./app-component"
import { navigate } from "./router"
import '../style.css';
window.addEventListener('load', navigate)
window.addEventListener('hashchange', navigate)

