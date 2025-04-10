import { html, render } from "lit-html";

class AddShiftComponent extends HTMLElement {    
    private responseMessage = { text: "", type: "" };
    private isModalVisible: boolean = false;
    private _shiftStartTime: Date | null = null;
    private _shiftEndTime: Date | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get shiftStartTime() {
        return this._shiftStartTime;
    }
    set shiftStartTime(value: Date | null) {
        if (this._shiftStartTime !== value) {
            this._shiftStartTime = value;
            this.renderComponent();
        }
    }
    get shiftEndTime() {
        return this._shiftEndTime;
    }
    set shiftEndTime(value: Date | null) {
        if (this._shiftEndTime !== value) {
            this._shiftEndTime = value;
            this.renderComponent();
        }
    }

    async connectedCallback() {
        await this.loadStyles();
        this.renderComponent();
        console.log('start time: ' + this.shiftStartTime);
        console.log('end time: ' + this.shiftEndTime);
    }

    static get observedAttributes() {
        return ['shift-start-time', 'shift-end-time'];
    }
    
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
    
        if (name === 'shift-start-time') {
            this.shiftStartTime = new Date(newValue!);
            console.log('shiftStartTime set via attribute:', this.shiftStartTime);
        } else if (name === 'shift-end-time') {
            this.shiftEndTime = new Date(newValue!);
            console.log('shiftEndTime set via attribute:', this.shiftEndTime);
        }
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
                this.responseMessage = { text: `Network Error: ${error}`, type: "is-danger" };
            }

            startTimeInput.value = "";
            endTimeInput.value = "";
        } else {
            this.responseMessage = { text: "Please fill in all fields", type: "is-danger" };
        }

        this.isModalVisible = true;
        this.renderComponent();
    }

    private closeNotification = () => {
        this.isModalVisible = false;
        this.responseMessage = { text: "", type: "" };
        this.renderComponent();
    };

    private renderComponent() {
        render(this.template(), this.shadowRoot!);
    
        const startInput = this.shadowRoot?.querySelector<HTMLInputElement>("#start_time");
        const endInput = this.shadowRoot?.querySelector<HTMLInputElement>("#end_time");
    
        if (startInput && this.shiftStartTime) {
            startInput.value = this.formatDateTimeLocal(this.shiftStartTime);
        }
        if (endInput && this.shiftEndTime) {
            endInput.value = this.formatDateTimeLocal(this.shiftEndTime);
        }
    }

    private formatDateTimeLocal(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

            <div id="responseMessage" class="notification ${this.responseMessage.type}" ?hidden=${!this.isModalVisible}>
                <button class="delete" @click=${this.closeNotification}></button>
                <p>${this.responseMessage.text}</p>
            </div>
            </div>
        `;
    }

}

customElements.define("add-shift-component", AddShiftComponent);