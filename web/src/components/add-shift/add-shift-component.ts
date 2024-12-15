import { html, render } from "lit-html";
import { Shift } from "../../models/shift";

class AddShiftComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const cssResponse = await fetch("../../../style.css");
        const css = await cssResponse.text();

        const styleElement = document.createElement("style");
        styleElement.textContent = css;
        this.shadowRoot.appendChild(styleElement);

        this.renderComponent();
    }

    renderComponent() {
        render(this.template(), this.shadowRoot);
    }

    template() {
        return html`
            <h2>Add Shift</h2>
        `
    }
}

customElements.define("add-shift-component", AddShiftComponent);