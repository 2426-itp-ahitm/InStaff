import { html, render } from "lit-html";

class AddRoleComponent extends HTMLElement {
    responseMessage: string = "";

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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

    async addRole() {
        const shadowRoot = this.shadowRoot!;
        const roleNameInput = shadowRoot.querySelector<HTMLInputElement>("#role_name");
        debugger
        if (roleNameInput?.value.trim()) {
            const addingRole = {
                roleName: roleNameInput.value,
                companyId: 1
            };

            try {
                const response = await fetch('http://localhost:4200/api/roles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addingRole)
                });

                if (response.ok) {
                    const result = await response.json();
                    this.responseMessage = "Role added successfully!";
                } else {
                    this.responseMessage = `Error: ${response.statusText}`;
                }
            } catch (error) {
                this.responseMessage = `Error: ${error}`;
            }

            roleNameInput.value = "";
        } else {
            this.responseMessage = "Please fill in all fields";
        }

        this.renderComponent();
    }

    template() {
        return html`
           <h2 class="title is-3">Add Role</h2>
           <div class="box">
              <div class="field">
                 <label for="role_name" class="label">Role Name</label>
                 <div class="control">
                    <input type="text" id="role_name" name="role_name" class="input" placeholder="Role Name" />
                 </div>
              </div>
           

           <div class="field">
              <div class="control">
                 <button class="button is-primary" @click=${() => this.addRole()}>Add Role</button>
              </div>
           </div>

           <div id="responseMessage" class="notification is-light">
              ${this.responseMessage}
           </div>
           </div>
        `;
    }
}

customElements.define("add-role-component", AddRoleComponent);