import { html, render } from "lit-html";

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

        if (startTimeInput?.value.trim() && endTimeInput?.value.trim()) {
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
                });

                if (response.ok) {
                    const result = await response.json();
                    this.responseMessage = "Shift added successfully!";
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

    template() {
        return html`
           <h2 class="title is-3">Add Shift</h2>
           <form class="box">
              <div class="field">
                 <label for="start_time" class="label">Start Time</label>
                 <div class="control">
                    <input type="datetime-local" id="start_time" name="start_time" class="input" />
                 </div>
              </div>
              
              <div class="field">
                 <label for="end_time" class="label">End Time</label>
                 <div class="control">
                    <input type="datetime-local" id="end_time" name="end_time" class="input" />
                 </div>
              </div>
           </form>

           <div class="field">
              <div class="control">
                 <button class="button is-primary" @click=${() => this.addShift()}>Add Shift</button>
              </div>
           </div>

           <div id="responseMessage" class="notification is-light">
              ${this.responseMessage}
           </div>
        `;
    }
}

customElements.define("add-shift-component", AddShiftComponent);