import { html, render } from "lit-html";

class AddShiftComponent extends HTMLElement {
    private responseMessage = { text: "", type: "" };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.loadStyles();
        this.renderComponent();
    }

    private async loadStyles() {
        try {
            const cssResponse = await fetch("../../../style.css");
            const css = await cssResponse.text();
            const styleElement = document.createElement("style");
            styleElement.textContent = css;
            this.shadowRoot?.appendChild(styleElement);
        } catch (error) {
            console.error("Error loading styles:", error);
        }
    }

    private async addShift() {
        const shadowRoot = this.shadowRoot!;
        const startTimeInput = shadowRoot.querySelector<HTMLInputElement>("#start_time");
        const endTimeInput = shadowRoot.querySelector<HTMLInputElement>("#end_time");

        if (startTimeInput?.value.trim() && endTimeInput?.value.trim()) {
            const addingShift = {
                startTime: startTimeInput.value + ":00",
                endTime: endTimeInput.value + ":00",
                companyId: 1
            };

            try {
                const response = await fetch('http://localhost:4200/api/shifts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addingShift)
                });

                if (response.ok) {
                    this.responseMessage = { text: "Shift added successfully!", type: "is-success" };
                } else {
                    this.responseMessage = { text: `Error: ${response.statusText}`, type: "is-danger" };
                }
            } catch (error) {
                this.responseMessage = { text: `Error: ${error}`, type: "is-danger" };
            }

            startTimeInput.value = "";
            endTimeInput.value = "";
        } else {
            this.responseMessage = { text: "Please fill in all fields", type: "is-danger" };
        }

        this.renderComponent();
    }

    private closeNotification() {
        this.responseMessage = { text: "", type: "" };
        this.renderComponent;
    }

    private renderComponent() {
        render(this.template(), this.shadowRoot!);
    }

    private template() {
        return html`
            <h2 class="title is-3">Add Shift</h2>
            <div class="box">
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
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-primary" @click=${() => this.addShift()}>Add Shift</button>
                </div>
            </div>

            <!-- Notification -->
            <div id="responseMessage" class="notification ${this.responseMessage.type}" ?hidden=${this.responseMessage.text === ""}>
                <button class="delete" @click=${this.closeNotification}></button>
                <p>${this.responseMessage.text}</p>
            </div>
        `;
    }
}

customElements.define("add-shift-component", AddShiftComponent);