import { html, render } from "lit-html";

class LandingPageComponent extends HTMLElement {
   activeForm = ""; 
   userRole = "employee";
   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   connectedCallback() {
      this.renderLandingPage();
   }

   async renderLandingPage() {
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      render(this.htmlTemplate(), this.shadowRoot);
   }

   showForm(formType) {
      this.activeForm = formType;
      this.renderLandingPage();
   }

   updateRole(event) {
      this.userRole = event.target.value;
   }

   loginForm() {
      return html`
         <div class="box">
            <h2 class="title">Log In</h2>
            <div class="field">
               <label class="label">Email</label>
               <div class="control">
                  <input class="input" type="email" placeholder="you@example.com">
               </div>
            </div>

            <div class="field">
               <label class="label">Password</label>
               <div class="control">
                  <input class="input" type="password" placeholder="Enter password">
               </div>
            </div>

            <div class="control">
               <button class="button is-info">
                  <a href="#/instaff" style="text-decoration: none; color: inherit;">Log In</a>
               </button>
            </div>
         </div>
      `;
   }

   registerForm() {
      return html`
         <div class="box">
            <h2 class="title">Create an Account</h2>
            <div class="field">
               <label class="label">Firstname</label>
               <div class="control">
                  <input class="input" type="text" placeholder="Firstname">
               </div>
               <label class="label">Lastname</label>
               <div class="control">
                  <input class="input" type="text" placeholder="Lastname">
               </div>
            </div>

            <div class="field">
               <label class="label">Email</label>
               <div class="control">
                  <input class="input" type="email" placeholder="you@example.com">
               </div>
            </div>

            <div class="field">
               <label class="label">Password</label>
               <div class="control">
                  <input class="input" type="password" placeholder="Enter password">
               </div>
            </div>
            <div class="field">
               <div class="control">
                  <input class="input" type="password" placeholder="Retype password">
               </div>
            </div>

            <div class="field">
               <label class="label">Role</label>
               <div class="control">
                  <label class="radio">
                     <input type="radio" name="role" value="manager" ?checked=${this.userRole === "manager"} @change=${this.updateRole}>
                     Manager
                  </label>
                  <label class="radio">
                     <input type="radio" name="role" value="employee" ?checked=${this.userRole === "employee"} @change=${this.updateRole}>
                     Employee
                  </label>
               </div>
            </div>

            <div class="control">
               <button class="button is-primary">
                  <a href="#/instaff" style="text-decoration: none; color: inherit;">Sign Up</a>
               </button>
            </div>
         </div>
      `;
   }

   htmlTemplate() {
      return html`
         <div class="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div class="has-text-centered">
               <img src="../../../images/logo-temp.webp" style="width: 200px; height: 200px;" alt="InStaff">
               <p class="subtitle">employee management at its finest</p>

               <div class="buttons is-centered">
                  <button class="button is-info" @click=${() => this.showForm("login")}>Log In</button>
                  <button class="button is-success" @click=${() => this.showForm("register")}>Sign Up</button>
               </div>

               <!-- Conditional Form Rendering -->
               ${this.activeForm === "login" ? this.loginForm() 
               : this.activeForm === "register" ? this.registerForm() 
               : ""}
            </div>
         </div>
      `;
   }
}

customElements.define("landing-page-component", LandingPageComponent);