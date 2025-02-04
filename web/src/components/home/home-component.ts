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
      <a href="${card.link}" class="card ${card.class} col-md-3 m-4">
         <div class="card-body">
            <div class="card-icon mb-3">
               <i class="bi ${card.icon}" style="font-size: 25px"></i>
            </div>
            <h5 class="card-title">${card.title}</h5>
            <p class="card-text">${card.description}</p>
         </div>
      </a>
      `
   );

   return html`
      <div class="container">
         <h1 class="display-4 text-center my-4">Alexander's Company</h1>
         <p class="text-center">Manager: Alexander Hahn</p>
      </div>
      <main class="container">
         <section class="row justify-content-center">
            ${cardTemplates}
         </section>
      </main>
   `;
};

class HomeComponent extends HTMLElement {
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

      render(dashboardTemplate(), this.shadowRoot);
   }
}

customElements.define("home-component", HomeComponent);