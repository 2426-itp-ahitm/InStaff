import { html, render } from "lit-html";

const template = () => {
   return html`
   <nav class="navbar">
      <div class="navbar-brand">
         <a class="navbar-item" href="#/">InStaff</a>
         <button class="navbar-burger burger" data-target="navbarMenu" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
         </button>
      </div>

      <div id="navbarMenu" class="navbar-menu">
         <div class="navbar-start">
            <a class="navbar-item" href="#/instaff">Home</a>
            <a class="navbar-item" href="#/employee-list">Employee List</a>
            <a class="navbar-item" href="#/add-employee">Add Employee</a>
            <a class="navbar-item" href="#/shift-list">Shift List</a>
            <a class="navbar-item" href="#/add-shift">Add Shift</a>
            <a class="navbar-item" href="#/edit-shift">Edit Shift</a>
         </div>
      </div>
   </nav>
   `;
};

class NavBarComponent extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   async connectedCallback() {
      const cssResponse = await fetch("../../../style.css")
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);
      this.addEventListeners();

      render(template(), this.shadowRoot);
   }

   addEventListeners() {
      const burger = this.shadowRoot.querySelector(".navbar-burger");
      const menu = this.shadowRoot.querySelector("#navbarMenu");
      
      burger?.addEventListener("click", () => {
         burger.classList.toggle("is-active");
         menu.classList.toggle("is-active");
      });
   }
}

customElements.define("nav-bar-component", NavBarComponent);