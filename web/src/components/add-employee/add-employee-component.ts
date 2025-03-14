import { html, render } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { Role } from "../../interfaces/role";
import { loadAllRoles } from "../role-list/role-list-service";

class AddEmployeeComponent extends HTMLElement {
   private responseMessage = { text: "", type: "" };
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
         this.responseMessage = { text: "Failed to load roles.", type: "is-danger" };
      }
   }

   private textInput() {
      const textInput = document.querySelector<HTMLInputElement>("text_input");

      console.log("textInput", textInput);
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
      });
   }

   getCheckedRoleIds(): string[] {
      const checkboxes = this.shadowRoot?.querySelectorAll<HTMLInputElement>('input[name="role_id"]:checked');
      console.log(document.querySelectorAll('.control input[name="role_id"]:checked'));
      return Array.from(checkboxes).map(checkbox => checkbox.value);
  }

   private async addEmployee() {
      const shadowRoot = this.shadowRoot!;
      const firstnameInput = shadowRoot.querySelector<HTMLInputElement>("#first_name");
      const lastnameInput = shadowRoot.querySelector<HTMLInputElement>("#last_name");
      const emailInput = shadowRoot.querySelector<HTMLInputElement>("#email");
      const telephoneInput = shadowRoot.querySelector<HTMLInputElement>("#telephone");
      const birthdateInput = shadowRoot.querySelector<HTMLInputElement>("#birthdate");
      const roleIdInput = this.getCheckedRoleIds();
      
      if (
         firstnameInput?.value.trim() &&
         lastnameInput?.value.trim() &&
         emailInput?.value.trim() &&
         telephoneInput?.value.trim() &&
         birthdateInput?.value.trim()
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

                try {
                  await this.assignRole(employeeId, roleIdInput);
                  this.responseMessage = { text: "Employee added successfully!", type: "is-success" };
                } catch (error) {
                  this.responseMessage = { text: `Error: ${error}`, type: "is-danger" };
                }
               this.resetForm();
            } else {
               this.responseMessage = { text: `Error: ${response.statusText}`, type: "is-danger" };
            }
         } catch (error) {
            this.responseMessage = { text: `Error: ${error}`, type: "is-danger" };
         }
      } else {
         this.responseMessage = { text: "Error: Please fill in all fields!", type: "is-danger" };
      }

      this.renderComponent();
   }

   private async assignRole(employeeId: number, roleIdInput: string[]) {
      for (let index = 0; index < roleIdInput.length; index++) {
         try {
            const response = await fetch(
               `http://localhost:4200/api/employees/${employeeId}/assignrole/${roleIdInput[index]}`,
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
   }

   private resetForm() {
      const inputs = this.shadowRoot?.querySelectorAll("input, select");
      inputs?.forEach((input) => input.setAttribute("value", ""));
   }

   private renderComponent() {
      render(this.template(), this.shadowRoot!);
   }

   private closeNotification() {
      this.responseMessage = { text: "", type: "" };
      this.renderComponent
   }

   private template() {
      return html`
         <h2 class="title is-3">Add an Employee</h2>
         <div class="box">
            <div class="field">
               <label for="first_name" class="label">First Name</label>
               <div class="control">
                  <input type="text" id="first_name" name="first_name" class="input" placeholder="First Name" />
               </div>
            </div>

            <div class="field">
               <label for="last_name" class="label">Last Name</label>
               <div class="control">
                  <input type="text" id="last_name" name="last_name" class="input" placeholder="Last Name" />
               </div>
            </div>

            <div class="field">
               <label for="email" class="label">Email</label>
               <div class="control">
                  <input type="email" id="email" name="email" class="input" placeholder="Email" />
               </div>
            </div>

            <div class="field">
               <label for="telephone" class="label">Telephone</label>
               <div class="control">
                  <input type="text" id="telephone" name="telephone" class="input" placeholder="Telephone" />
               </div>
            </div>

            <div class="field">
               <label for="birthdate" class="label">Birthdate</label>
               <div class="control">
                  <input type="date" id="birthdate" name="birthdate" class="input" />
               </div>
            </div>

            <div class="field">
               <label class="label">Choose a role:</label>
               <div class="control">
                  ${this.roles.map(
                        (role) => html`
                           <label>
                              <input type="checkbox" name="role_id" value="${role.id}"> ${role.roleName}
                           </label><br>
                        `
                  )}
               </div>
            </div>

            <div class="field">
               <div class="control">
                  <button type="button" class="button is-primary" @click=${() => this.addEmployee()}>Add Employee</button>
               </div>
            </div>
         </div>

         <div id="responseMessage" class="notification ${this.responseMessage.type}" ?hidden=${this.responseMessage.text == ""}>
            <button class="delete" @click=${this.closeNotification}></button>
            <p>${this.responseMessage.text}</p>
         </div>
      `;
   }

   
}

customElements.define("add-employee-component", AddEmployeeComponent);