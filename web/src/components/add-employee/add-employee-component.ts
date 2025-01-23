import { html, render } from "lit-html";
import { Employee } from "../../models/employee";
import { Role } from "../../models/role";
import { loadAllRoles } from "../role-list/role-list-service";

class AddEmployeeComponent extends HTMLElement {
   private responseMessage: string = "";
   private roles: Role[] = [];

   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   async connectedCallback() {
      await this.loadStyles();
      await this.getRoles();
      this.renderComponent();
      this.textInput();
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

   private async getRoles() {
      try {
         this.roles = await loadAllRoles();
      } catch (error) {
         console.error("Error loading roles:", error);
         this.responseMessage = "Failed to load roles.";
      }
   }

   private textInput(){
      // Assuming you have an input field in your HTML
      const textInput = document.querySelector<HTMLInputElement>("text_input");

      console.log("textInput", textInput);
      // Apply the function to the input element
      if (textInput) {
         this.preventNumbersInput(textInput);
      }
   }
   private preventNumbersInput(inputElement: HTMLInputElement) {
      inputElement.addEventListener("input", (event) => {
         console.log("Input event fired!");
         const input = event.target as HTMLInputElement;
   
         // Remove any number characters from the input value
         input.value = input.value.replace(/[0-9]/g, "");
   
         // Optionally, show a warning or message (if needed)
         // Example: input.setCustomValidity("Numbers are not allowed.");
         // input.reportValidity();
      });
   }

   private async addEmployee() {
      const shadowRoot = this.shadowRoot!;
      const firstnameInput = shadowRoot.querySelector<HTMLInputElement>("#first_name");
      const lastnameInput = shadowRoot.querySelector<HTMLInputElement>("#last_name");
      const emailInput = shadowRoot.querySelector<HTMLInputElement>("#email");
      const telephoneInput = shadowRoot.querySelector<HTMLInputElement>("#telephone");
      const birthdateInput = shadowRoot.querySelector<HTMLInputElement>("#birthdate");
      const roleIdInput = shadowRoot.querySelector<HTMLSelectElement>("#role_id");

      if (
         firstnameInput?.value.trim() &&
         lastnameInput?.value.trim() &&
         emailInput?.value.trim() &&
         telephoneInput?.value.trim() &&
         birthdateInput?.value.trim() &&
         roleIdInput?.value.trim()
      ) {
         const addingEmployee = {
            firstname: firstnameInput.value,
            lastname: lastnameInput.value,
            email: emailInput.value,
            telephone: telephoneInput.value,
            password: "password",
            birthdate: birthdateInput.value,
            companyId: 1,
         };

         try {
            const response = await fetch("http://localhost:4200/api/employees", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(addingEmployee),
            });

            if (response.ok) {
               const result = await response.json();
               const employeeId = result.id;

               await this.assignRole(employeeId, roleIdInput.value);
               this.responseMessage = "Employee added successfully!";
               this.resetForm();
            } else {
               this.responseMessage = `Error: ${response.statusText}`;
            }
         } catch (error) {
            this.responseMessage = `Error: ${error}`;
         }
      } else {
         this.responseMessage = "Error: Please fill in all fields!";
      }

      this.renderComponent();
   }

   private async assignRole(employeeId: number, roleId: string) {
      try {
         const response = await fetch(
            `http://localhost:4200/api/employees/${employeeId}/assignrole/${roleId}`,
            {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
            }
         );

         if (!response.ok) {
            throw new Error(`Failed to assign role: ${response.statusText}`);
         }
      } catch (error) {
         console.error("Error assigning role:", error);
         throw error;
      }
   }

   private resetForm() {
      const inputs = this.shadowRoot?.querySelectorAll("input, select");
      inputs?.forEach((input) => input.setAttribute("value", ""));
   }

   private renderComponent() {
      render(this.template(), this.shadowRoot!);
   }

   private template() {
      return html`
         <h2>Add an Employee</h2>
         <form>
            <!--
            <label for="text_input">Text Input</label>
            <input type="text" id="text_input" />
            <br />
            -->
            <label for="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name" />
            <br />
            <label for="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name" />
            <br />
            <label for="email">Email</label>
            <input type="text" id="email" name="email" />
            <br />
            <label for="telephone">Telephone</label>
            <input type="text" id="telephone" name="telephone" />
            <br />
            <label for="birthdate">Birthdate</label>
            <input type="date" id="birthdate" name="birthdate"/>
            <br />
            <label for="role_id">Choose a role:</label>
            <select id="role_id" name="role_id">
               ${this.roles.map(
                  (role) =>
                     html`<option value="${role.id}">${role.roleName}</option>`
               )}
            </select>
         </form>
         <button @click=${() => this.addEmployee()}>Add Employee</button>

         <div id="responseMessage">${this.responseMessage}</div>
      `;
   }
}

customElements.define("add-employee-component", AddEmployeeComponent);