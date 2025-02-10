import { html, render } from "lit-html";

class EditShiftComponent extends HTMLElement {
    responseMessage: string = "";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const cssResponse = await fetch("../../../style/style.css")
        const css = await cssResponse.text();

        const styleElement = document.createElement("style");
        styleElement.textContent = css;
        this.shadowRoot.appendChild(styleElement);

        this.renderComponent();
    }

    renderComponent() {
        render(this.template(), this.shadowRoot);
    }

    employees: any[] = [];

    getEmployeeNames() {
        fetch("http://localhost:4200/api/employees")
            .then((response) => response.json())
            .then((data) => {
                const employeeIdSelect = this.shadowRoot!.querySelector<HTMLSelectElement>("#employee_id");
                if (employeeIdSelect) {
                    console.log(data);
                    data.forEach((employee: any) => {
                        const option = document.createElement("option");
                        option.value = employee.id;
                        option.text = `${employee.firstname} ${employee.lastname}`;
                        employeeIdSelect.appendChild(option);
                    });
                }
            })
            .catch((error) => {
                this.responseMessage = `Error: ${error}`;
                this.renderComponent();
            });
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
            console.log(apiEndpoint);
            try {
                const response = await fetch(apiEndpoint, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log(response)

                if (response.ok) {
                    this.responseMessage = "Shift assigned successfully";
                } else {
                    this.responseMessage = `Error: ${response.statusText}`;
                }
            } catch (error) {
                this.responseMessage = `1 Error: ${error}`;
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
                <select id="employee_id" name="employee_id" value="Select Employee">
                    ${this.getEmployeeNames()}
                </select>
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