import 'bulma/css/bulma.min.css';
import './style/style.scss';
import './app-component';
import { navigate } from './router';

window.addEventListener('load', navigate)
window.addEventListener('hashchange', navigate)