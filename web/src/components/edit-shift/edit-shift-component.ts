import { html, render } from "lit-html";

class EditShiftComponent extends HTMLElement {
    responseMessage: string = "";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
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

    async assignShiftToEmployee() {
        const shadowRoot = this.shadowRoot!;
        const employeeIdInput = shadowRoot.querySelector<HTMLInputElement>("#employee_id");
        const shiftIdInput = shadowRoot.querySelector<HTMLInputElement>("#shift_id");
        const roleIdInput = shadowRoot.querySelector<HTMLInputElement>("#role_id");

        if (
            employeeIdInput?.value.trim() &&
            shiftIdInput?.value.trim() &&
            roleIdInput?.value.trim()
        ) {
            const employeeId = employeeIdInput.value.trim();
            const shiftId = shiftIdInput.value.trim();
            const roleId = roleIdInput.value.trim();

            const apiEndpoint = `http://localhost:4200/api/employees/${employeeId}/assignshift/${shiftId}/${roleId}`;

            try {
                const response = await fetch(apiEndpoint, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    this.responseMessage = JSON.stringify(result);
                } else {
                    this.responseMessage = `Error: ${response.statusText}`;
                }
            } catch (error) {
                this.responseMessage = `Error: ${error}`;
            }

            employeeIdInput.value = "";
            shiftIdInput.value = "";
            roleIdInput.value = "";
        } else {
            this.responseMessage = "Please fill in all fields";
        }

        this.renderComponent();
    }

    template() {
        return html`
            <h2>Assign Shift to Employee</h2>
            <form>
                <label for="employee_id">Employee ID</label>
                <input type="number" id="employee_id" name="employee_id" />
                <br />
                <label for="shift_id">Shift ID</label>
                <input type="number" id="shift_id" name="shift_id" />
                <br />
                <label for="role_id">Role ID</label>
                <input type="number" id="role_id" name="role_id" />
                <br />
            </form>
            <button @click=${() => this.assignShiftToEmployee()}>Assign</button>
            <div id="responseMessage">${this.responseMessage}</div>
        `;
    }
}

customElements.define("edit-shift-component", EditShiftComponent);