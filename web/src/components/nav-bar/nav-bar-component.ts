import { html, render } from "lit-html";

const template = () => html`
   <nav class="navbar">
      <div class="navbar-brand">
         <a class="navbar-item" href="#/instaff" >
            <img src="../../images/logo-black.png" style="width: 10vw, height:auto; padding: 0,1%" alt="InStaff" />
         </a>
         <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
         </a>
      </div>

      <div class="navbar-menu">
         <div class="navbar-start">
            <a class="navbar-item" href="#/employee-list">Employee List</a>
            <a class="navbar-item" href="#/add-employee">Add Employee</a>
            <a class="navbar-item" href="#/shift-list">Shift List</a>
            <a class="navbar-item" href="#/add-shift">Add Shift</a>
            <a class="navbar-item" href="#/edit-shift">Edit Shift</a>
         </div>
      </div>
   </nav>
`;

class NavBarComponent extends HTMLElement {
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

      render(template(), this.shadowRoot);
      this.addEventListeners();
   }

   addEventListeners() {
      const burger = this.shadowRoot?.querySelector(".navbar-burger");
      const menu = this.shadowRoot?.querySelector(".navbar-menu");
      const links = this.shadowRoot?.querySelectorAll(".navbar-item");

      if (burger && menu) {
         burger.addEventListener("click", () => {
            const isActive = burger.classList.toggle("is-active");
            menu.classList.toggle("is-active", isActive);
         });

         links.forEach(link => {
            link.addEventListener("click", () => {
               if (window.matchMedia("(max-width: 1024px)").matches) {
                  burger.classList.remove("is-active");
                  menu.classList.remove("is-active");
               }
            });
         });
      }
   }
}

customElements.define("nav-bar-component", NavBarComponent);