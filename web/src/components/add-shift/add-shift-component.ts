import { html, render } from "lit-html";
import { Shift } from "../../models/shift";

class AddShiftComponent extends HTMLElement {
    responseMessage: string = "";

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

    async addShift() {
        const shadowRoot = this.shadowRoot!;
        const startTimeInput = shadowRoot.querySelector<HTMLInputElement>("#start_time");
        const endTimeInput = shadowRoot.querySelector<HTMLInputElement>("#end_time");

        if (startTimeInput?.value.trim() &&
            endTimeInput?.value.trim()) {
            const addingShift = {
                startTime: startTimeInput.value + ":00",
                endTime: endTimeInput.value + ":00",
                companyId: 1
            };

            console.log(addingShift);
            try {
                const response = await fetch('http://localhost:4200/api/shifts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addingShift)
                })

                if (response.ok) {
                    const result = await response.json();
                    this.responseMessage = JSON.stringify(result);
                } else {
                    this.responseMessage = `Error: ${response.statusText}`;
                }
            } catch (error) {
                this.responseMessage = `Error: ${error}`;
            }

            startTimeInput.value = "";
            endTimeInput.value = "";
        } else {
            this.responseMessage = "Please fill in all fields";
        }

        this.renderComponent();
    }
    /*
 
        POST http://localhost:8080/api/shifts
        Content-Type: application/json
 
        {
        "startTime": "2024-12-10T09:00:00",
        "endTime": "2024-12-10T17:00:00",
        "companyId": 1
        }
 
    */
    template() {
        return html`
           <h2>Add Shift</h2>
           <form>
              <label for="start_time">Start Time</label>
              <input type="datetime-local" id="start_time" name="start_time" />
              <br>
              <label for="end_time">End Time</label>
              <input type="datetime-local" id="end_time" name="end_time" />
              <br>
           </form>
           <button @click=${() => this.addShift()}>Add Shift</button>
           <div id="responseMessage">${this.responseMessage}</div>
           
        `;

    }
}

customElements.define("add-shift-component", AddShiftComponent);