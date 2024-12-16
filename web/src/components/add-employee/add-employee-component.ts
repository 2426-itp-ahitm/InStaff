import { html, render } from "lit-html";
import { Employee } from "../../models/employee";

class AddEmployeeComponent extends HTMLElement {
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

   async addEmployee() {
      const shadowRoot = this.shadowRoot!;
      const firstnameInput = shadowRoot.querySelector<HTMLInputElement>("#first_name");
      const lastnameInput = shadowRoot.querySelector<HTMLInputElement>("#last_name");
      const emailInput = shadowRoot.querySelector<HTMLInputElement>("#email");
      const telephoneInput = shadowRoot.querySelector<HTMLInputElement>("#telephone");
      const birthdateInput = shadowRoot.querySelector<HTMLInputElement>("#birthdate");

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
            companyId: 1
         };
         console.log(addingEmployee);
         
         
         try{
            const response = await fetch('http://localhost:4200/api/employees', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify(addingEmployee)
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

         firstnameInput.value = "";
         lastnameInput.value = "";
         emailInput.value = "";
         telephoneInput.value = "";
         birthdateInput.value = "";
      } else {
         this.responseMessage = "Error: Please fill in all fields!";
      }

      this.renderComponent();
   }

   template() {
      return html`
         <h2>Add an Employee</h2>
         <form>
            <label for="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name" />
            <br>
            <label for="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name" />
            <br>
            <label for="email">Email</label>
            <input type="text" id="email" name="email" />
            <br>
            <label for="telephone">Telephone</label>
            <input type="text" id="telephone" name="telephone" />
            <br>
            <label for="birthdate">Birthdate</label>
            <input type="text" id="birthdate" name="birthdate" />
         </form>
         <button @click=${() => this.addEmployee()}>Add Employee</button>

         <div id="responseMessage">${this.responseMessage}</div>
      `;
   }
}

customElements.define("add-employee-component", AddEmployeeComponent);