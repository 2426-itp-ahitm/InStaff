import { html, render } from "lit-html"
import "./employee-list"
import "./activity-list"
import "./test-component"

const content = html`
    <div class="container">
        <h2>Employee List</h2>
        
        <employee-list-component></employee-list-component>
        <h2>Field of Activity List</h2>
        <activity-list-component></activity-list-component>
        <test-component></test-component>
    </div>

    
`

class AppComponent extends HTMLElement {
    connectedCallback() {
        render(content, this)
    }
}
customElements.define("app-component", AppComponent)