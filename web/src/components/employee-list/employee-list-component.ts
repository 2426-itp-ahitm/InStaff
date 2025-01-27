import { html, render } from "lit-html"
import { Employee } from "../../interfaces/employee"
import { loadAllEmployees } from "./employee-list-service"
import { model, subscribe } from "../../model/model"

class EmployeeListComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    async connectedCallback() {
        const cssResponse = await fetch("../../../style.css")
        const css = await cssResponse.text()

        const styleElement = document.createElement("style")
        styleElement.textContent = css

        this.shadowRoot.appendChild(styleElement)
        
        // Subscribe to model updates
        subscribe(model => {
            console.log("Model updated:", model)
            this.render(model.employees, model.activeEmployeeId)
        })

        // Load employees initially
        await loadAllEmployees()
    }

    render(employees: Employee[], activeEmployeeId: number) {
        render(this.template(employees, activeEmployeeId), this.shadowRoot)
    }

    template(employees: Employee[], activeEmployeeId: number) {
        const rows = employees.map(employee =>
            html`
                <tr @click=${() => this.showEmployeeDetail(employee.id)}>
                    <td>${employee.firstname}</td>
                    <td>${employee.lastname}</td>
                    <td>${employee.company_name}</td>
                </tr>
            `
        )

        return html`
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }
                tr:hover {
                    background-color: #f5f5f5;
                    cursor: pointer;
                }
            </style>
            <h2>Employees</h2>
            <table>
                <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Company Name</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            ${activeEmployeeId
                ? html`
                    <employee-detail-component .employeeId=${activeEmployeeId}></employee-detail-component>
                  `
                : html`<p>Select an employee to view details</p>`
            }
        `
    }

    showEmployeeDetail(id: number) {
        console.log("Selected Employee ID:", id)
        model.activeEmployeeId = id // Update the model with the selected employee ID
    }
}

customElements.define("employee-list-component", EmployeeListComponent)