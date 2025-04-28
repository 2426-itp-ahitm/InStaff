import { html, render } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { loadEmployeesFilteredByRole } from "../../services/employee-service";

class EmployeeFilterRolesComponent extends HTMLElement {
   inputValue: string = "";
   employees: Employee[] = [];

   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   static get observedAttributes() {
      return ["value"];
   }

   async connectedCallback() {
      const cssResponse = await fetch("../../../style/style.css")
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;

      this.shadowRoot.appendChild(styleElement);

      this.renderComponent();
   }

   attributeChangedCallback(name: string, _: string, value: string) {
      console.log("Attribute changed:", name, value);
      switch (name) {
         case "value":
            this.inputValue = value;
            break;
         default:
            console.log("Unknown attribute changed");
      }
      this.renderComponent();
   }

   renderComponent() {
      render(this.tableTemplate(this.employees), this.shadowRoot);
   }

   handleFilter = async () => {
      this.employees = await loadEmployeesFilteredByRole(this.inputValue);
      this.renderComponent();
   };

   async onButtonClicked() {
      const input = this.shadowRoot.querySelector<HTMLInputElement>("#role_name");
      if (input) {
         console.log("Button clicked, input value:", input.value);
         this.inputValue = input.value;
         this.employees = await loadEmployeesFilteredByRole(this.inputValue);
         this.renderComponent();
      }
   }

   tableTemplate(employees: Employee[]) {
      const rows = employees.map(
         (employee) => html`
            <tr>
               <td>${employee.firstname}</td>
               <td>${employee.lastname}</td>
               <td>${employee.email}</td>
               <td>${employee.telephone}</td>
               <td>${employee.birthdate}</td>
               <td>${employee.company_name}</td>
            </tr>
         `
      );

      return html`
         <h2>Filter Employees by Role</h2>

         <label for="role_name">Role Name</label>
         <input
            type="text"
            id="role_name"
            name="role_name"
            value=${this.inputValue}
         />
         <button @click=${() => this.onButtonClicked()}>Filter</button>

         <table>
            <thead>
               <tr>
                  <td>Firstname</td>   
                  <td>Lastname</td>
                  <td>Email</td>
                  <td>Tel</td>
                  <td>Birthdate</td>
                  <td>Company Name</td>
               </tr>
            </thead>
            <tbody>
               ${rows}
            </tbody>
         </table>
      `;
   }
}

customElements.define("employee-filter-roles-component", EmployeeFilterRolesComponent);