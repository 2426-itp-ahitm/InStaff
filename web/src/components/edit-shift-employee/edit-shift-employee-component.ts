import { html, render } from "lit-html";

class EmployeeDropdown extends HTMLElement {
    employees: { id: string; name: string }[] = [];

    connectedCallback() {
        this.getEmployeeNames();
    }

    async getEmployeeNames() {
        try {
            const response = await fetch("http://localhost:4200/api/employees");
            const data = await response.json();
            this.employees = data.map((employee: any) => ({
                id: employee.id,
                name: `${employee.firstname} ${employee.lastname}`,
            }));
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }

    render() {
        return html`
            <select id="employee_id">
                <option value="">Select an Employee</option>
                ${this.employees.map(
                    (employee) =>
                        html`<option value="${employee.id}">${employee.name}</option>`
                )}
            </select>
        `;
    }
}

customElements.define("edit-shift-employee", EmployeeDropdown);