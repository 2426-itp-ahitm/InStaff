import { html, render } from "lit-html"

const htmlTemplate =  html`
      <h1>Test Component</h1>
      <p>This is a test component</p>
   `

class TestComponent extends HTMLElement {
   async connectedCallback(){
      
      render(htmlTemplate, this)
   }
}

customElements.define("test-component", TestComponent)