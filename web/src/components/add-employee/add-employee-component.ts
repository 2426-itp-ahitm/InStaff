import { html, render } from "lit-html";
import { Employee } from "../../models/employee";

class AddEmployeeComponent extends HTMLElement {
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
      const cssResponse = await fetch("../../../style.css");
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
            <h2>Add a Employee</h2>

            <label for="first_name">First Name</label>
            <input
            type="text"
            id="first_name"
            name="first_name"
            value=${this.inputValue}
            />

            <label for="last_name">Last Name</label>
            <input
            type="text"
            id="last_name"
            name="last_name"
            value=${this.inputValue}
            />

            <label for="email">Email</label>
            <input
            type="text"
            id="email"
            name="email"
            value=${this.inputValue}
            />

            <label for="telephone">Telephone</label>
            <input
            type="text"
            id="telephone"
            name="telephone"
            value=${this.inputValue}
            />

            <label for="birthdate">Birthdate</label>
            <input
            type="text"
            id="birthdate"
            name="birthdate"
            value=${this.inputValue}
            />
            
      `;
   }
}

customElements.define("add-employee-component", AddEmployeeComponent);