import { html, render } from "lit-html"
import "../employee-list"

const content = html`
    <div class="container">
    

    </div>
`

class LoginPage extends HTMLElement {
    connectedCallback() {
        render(content, this)
    }
}
customElements.define("logIn", LoginPage)
