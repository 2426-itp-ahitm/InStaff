import { html, render } from "lit-html"
import "./employee-list"
import "./role-list"
import "./manager-list"

const content = html`
    <div class="container">
        <button onclick="document.getElementById('employee-list-component').style.display = 'inline'; document.getElementById('role-list-component').style.display = 'none';">Employee List</button>
        <button onclick="document.getElementById('role-list-component').style.display = 'inline'; document.getElementById('employee-list-component').style.display = 'none';">Role List</button>
        
        <employee-list-component style="display: none" id="employee-list-component"></employee-list-component>
        <role-list-component style="display: none" id="role-list-component"></role-list-component>
        <manager-list-component style="display: inline" id="manager-list-component"></manager-list-component>
    </div>
`

class AppComponent extends HTMLElement {
    connectedCallback() {
        render(content, this)
    }
}
customElements.define("app-component", AppComponent)