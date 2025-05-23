import { html, render } from "lit-html";

class EditShiftComponent extends HTMLElement {
    responseMessage: string = "";
    employees: any[] = [];
    shifts: any[] = [];
    roles: any[] = [];

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

        await this.getEmployeeNames();  // Make sure to fetch data before rendering
        this.renderComponent();
    }

    // Fetch employee, shift, and role data
    async getEmployeeNames() {
        try {
            const [employeeResponse, shiftResponse, roleResponse] = await Promise.all([
                fetch("http://localhost:4200/api/employees"),
                fetch("http://localhost:4200/api/shifts"),
                fetch("http://localhost:4200/api/roles")
            ]);

            const employees = await employeeResponse.json();
            const shifts = await shiftResponse.json();
            const roles = await roleResponse.json();

            this.employees = employees;
            this.shifts = shifts;
            this.roles = roles;

            const employeeIdSelect = this.shadowRoot!.querySelector<HTMLSelectElement>("#employee_id");
            const shiftIdSelect = this.shadowRoot!.querySelector<HTMLSelectElement>("#shift_id");
            const roleIdSelect = this.shadowRoot!.querySelector<HTMLSelectElement>("#role_id");

            if (employeeIdSelect) {
                this.employees.forEach((employee: any) => {
                    const option = document.createElement("option");
                    option.value = employee.id;
                    option.text = `${employee.firstname} ${employee.lastname}`;
                    employeeIdSelect.appendChild(option);
                });
            }

            if (shiftIdSelect) {
                this.shifts.forEach((shift: any) => {
                    const option = document.createElement("option");
                    option.value = shift.id;
                    option.text = `${shift.startTime} - ${shift.endTime}`;
                    shiftIdSelect.appendChild(option);
                });
            }

            if (roleIdSelect) {
                this.roles.forEach((role: any) => {
                    const option = document.createElement("option");
                    option.value = role.id;
                    option.text = role.name;  // Assuming roles have a 'name' property
                    roleIdSelect.appendChild(option);
                });
            }

        } catch (error) {
            this.responseMessage = `Error: ${error}`;
        }

        this.renderComponent();  // Always re-render after data fetch
    }

    async assignShiftToEmployee() {
        const shadowRoot = this.shadowRoot!;
        const employeeIdInput = shadowRoot.querySelector<HTMLSelectElement>("#employee_id");
        const shiftIdInput = shadowRoot.querySelector<HTMLSelectElement>("#shift_id");
        const roleIdInput = shadowRoot.querySelector<HTMLSelectElement>("#role_id");

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
                    this.responseMessage = "Shift assigned successfully";
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
            <h2 class="title is-3">Assign Shift to Employee</h2>
            <form class="box">
                <div class="field">
                    <label class="label" for="employee_id">Employee</label>
                    <div class="control">
                        <div class="select">
                            <select id="employee_id" name="employee_id">
                                <option value="">Select Employee</option>
                                ${this.employees.length > 0
                                    ? this.employees.map(
                                          (employee: any) =>
                                              html`<option value="${employee.id}">${employee.firstname} ${employee.lastname}</option>`
                                      )
                                    : html`<option value="">Loading employees...</option>`}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="field">
                    <label class="label" for="role_id">Role</label>
                    <div class="control">
                        <div class="select">
                            <select id="role_id" name="role_id">
                                <option value="">Select Role</option>
                                ${this.roles.length > 0
                                    ? this.roles.map(
                                          (role: any) =>
                                              html`<option value="${role.id}">${role.roleName}</option>`
                                      )
                                    : html`<option value="">Loading roles...</option>`}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="control">
                    <button 
                        class="button is-primary" 
                        @click=${() => this.assignShiftToEmployee()} 
                        ?disabled="${!this.employees.length || !this.shifts.length || !this.roles.length}">
                        Assign
                    </button>
                </div>
                <div id="responseMessage" class="notification ">${this.responseMessage}</div>
            </form>
        `;
    }

    renderComponent() {
        render(this.template(), this.shadowRoot);
    }
}

customElements.define("edit-shift-component", EditShiftComponent);