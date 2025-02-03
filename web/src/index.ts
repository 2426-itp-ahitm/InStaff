import 'bootstrap/dist/css/bootstrap.min.css'; // For Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // For Bootstrap Icons CSS
import './app-component';
import { navigate } from './router';
//import '../src/style.css';


window.addEventListener('load', navigate)
window.addEventListener('hashchange', navigate)