import { html, render } from "lit-html";

const dashboardTemplate = () => {
   const cards = [
      {
         title: "Remove Shift",
         description: "Remove existing shifts",
         icon: "bi-calendar-x",
         link: "#/remove-shift",
         class: "small",
      },
      {
         title: "Add Shift",
         description: "Add new shifts",
         icon: "bi-calendar-plus",
         link: "#/add-shift",
         class: "small",
      },
      {
         title: "Edit Employees",
         description: "Edit employee details",
         icon: "bi-person",
         link: "#/edit-employees",
         class: "small",
      },
      {
         title: "Employee List",
         description: "View all employees",
         icon: "bi-person-lines-fill",
         link: "#/employee-list",
         class: "small",
      },
      {
         title: "Calendar",
         description: "Check schedules",
         icon: "bi-calendar",
         link: "#/calendar",
         class: "wide",
      },
      {
         title: "Message Employees",
         description: "Communicate with employees",
         icon: "bi-chat",
         link: "#/message-employees",
         class: "wide",
      },
   ];

   const cardTemplates = cards.map(
      (card) => html`
      <div class="cell">
         <div class="card">
            <a class="card-content" href="${card.link}">
               <div class="content">
                  <p class="text">${card.icon}</p>
                  <p class="title">${card.title}</p>
                  <p class="subtitle">${card.description}</p>
               </div>
            </a>
         </div>
      </div>
      `
   );

   return html`
   <link rel="stylesheet" href="style.css">
   <nav-bar-component></nav-bar-component>
   <div>
      <h1>Alexander's Company</h1>
      <p>Manager: Alexander Hahn</p>
   </div>
   <div class="fixed-grid has-3-cols" is-light>
      <div class="grid">
         ${cardTemplates}
      </div>
   </div>
   `;
};

class HomeComponent extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   async connectedCallback() {
      /*
         const cssResponse = await fetch("../../../style.css")
         const css = await cssResponse.text();

         const styleElement = document.createElement("style");
         styleElement.textContent = css;
         this.shadowRoot.appendChild(styleElement);
      */
      render(dashboardTemplate(), this.shadowRoot);
   }
}

customElements.define("home-component", HomeComponent);