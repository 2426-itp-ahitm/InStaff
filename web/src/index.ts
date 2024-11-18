import "./app-component"
import { navigate } from "./router"
window.addEventListener('load', navigate)
window.addEventListener('hashchange', navigate)

