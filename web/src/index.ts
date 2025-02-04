import './app-component';
import { navigate } from './router';
import '../src/style/style.css';


window.addEventListener('load', navigate)
window.addEventListener('hashchange', navigate)