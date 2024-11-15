import { html, render } from "lit-html"
import "./test-component"

const content = html`
   <div class="login-container">
        <h2>Anmelden</h2>
        <form action="/login" method="POST">
            <input type="email" name="email" placeholder="E-Mail" required>
            <input type="password" name="password" placeholder="Passwort" required>
            <button type="submit">Anmelden</button>
        </form>
    </div>    
`

class AppComponent extends HTMLElement {
    connectedCallback() {
        render(content, this)
    }
}
customElements.define("app-component", AppComponent)