    
import { html, render } from "lit-html";

class AddShiftComponent extends HTMLElement {    
    private responseMessage = { text: "", type: "" };
    private _shiftStartTime: Date | null = null;
    private _shiftEndTime: Date | null = null;
    private isModalVisible: boolean = false;

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
            this.renderAddShift();
        }
    }
    get shiftEndTime() {
        return this._shiftEndTime;
    }
    set shiftEndTime(value: Date | null) {
        if (this._shiftEndTime !== value) {
            this._shiftEndTime = value;
            this.renderAddShift();
        }
    }

    public openWithTimes(start: string, end: string) {
        this.setAttribute("shift-start-time", start)
        this.setAttribute("shift-end-time", end)
    
        this.isModalVisible = true;
    
        this.renderAddShift()
    }

    async connectedCallback() {
        await this.loadStyles();
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
                    setTimeout(() => location.reload(), 500);
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

        setTimeout(() => {
            this.isModalVisible = false;
            this.renderAddShift();
        }, 3000);
    }

    private closeNotification = () => {
        this.isModalVisible = false;
        this.responseMessage = { text: "", type: "" };
        this.renderAddShift();
    };

    async renderAddShift() {
        if(!this._shiftEndTime) return;
        if(!this._shiftStartTime) return;

        const existingModal = this.shadowRoot?.querySelector("addShiftModal");
        if(existingModal) {
            existingModal.remove();
        }

        const cssResponse = await fetch("../../../style.css");
        const css = await cssResponse.text();
        const styleElement = document.createElement("style");
        styleElement.textContent = css;
        this.shadowRoot?.appendChild(styleElement);

        const startInput = this.shadowRoot?.querySelector<HTMLInputElement>("#start_time");
        const endInput = this.shadowRoot?.querySelector<HTMLInputElement>("#end_time");
    
        if (startInput && this.shiftStartTime) {
            startInput.value = this.formatDateTimeLocal(this.shiftStartTime);
        }
        if (endInput && this.shiftEndTime) {
            endInput.value = this.formatDateTimeLocal(this.shiftEndTime);
        }
        
        render(this.modalTemplate(), this.shadowRoot!);
    }

    closeModal() {
        this.isModalVisible = false;
        this.renderAddShift();
     }

    private formatDateTimeLocal(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    private modalTemplate() {
        return html`
            <div id="addShiftModal" class="modal ${this.isModalVisible ? 'is-active' : ''}">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <form method="dialog">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Add Shift</p>
                        </header>
                        <section class="modal-card-body">
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
                        </section>
                    </form>
                    <footer class="modal-card-foot">
                        <button class="button is-primary" @click=${() => this.addShift()}>Add Shift</button>
                        <button class="button" type="button" @click="${() => this.closeModal()}">Close</button>
                    </footer>
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