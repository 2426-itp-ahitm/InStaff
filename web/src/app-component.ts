import { html, render } from "lit-html"
import "./employee-list"

const content = html`
    <div class="container">
        <employee-list-component></employee-list-component>
    </div>
`

class AppComponent extends HTMLElement {
    connectedCallback() {
        render(content, this)
    }
}
customElements.define("app-component", AppComponent)