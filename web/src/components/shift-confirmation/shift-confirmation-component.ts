// src/components/shift-confirmation/shift-confirmation-component.ts
import { html, render, nothing } from "lit-html";
import { Shift } from "../../interfaces/shift";
import { Assignment } from "../../interfaces/assignment";
import { loadShiftDetailed } from "../shift-detail/shift-detail-service";
import RoleMapper from "../../mapper/role-mapper";
import EmployeeMapper from "../../mapper/employee-mapper";
import { DateTime } from "luxon";

class ShiftConfirmationComponent extends HTMLElement {
    private roleMapper = new RoleMapper();
    private employeeMapper = new EmployeeMapper();
    private _assignmentId: number | null = null;
    private _assignment: Assignment | null = null;
    private _shift: Shift | null = null;
    private _roleName: string | null = null;
    private _employeeName: string | null = null;
    private _isLoading: boolean = false;
    private _isUpdating: boolean = false;
    private _isAuthenticated: boolean = false;
    private _passwordInput: string = "";
    private _error: string | null = null;
    private _authError: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.initialize();
    }

    async initialize() {
        const cssResponse = await fetch("../../../style.css");
        const css = await cssResponse.text();
        const styleElement = document.createElement("style");
        styleElement.textContent = css;
        this.shadowRoot.appendChild(styleElement);

        const assignmentId = this.getAttribute("assignment-id");

        if (!assignmentId) {
            this._error = "Assignment ID is missing in URL.";
            this.renderComponent();
            return;
        }

        this._assignmentId = Number(assignmentId);
        if (isNaN(this._assignmentId)) {
            this._error = "Invalid Assignment ID.";
            this.renderComponent();
            return;
        }

        await this.loadData();
    }

    async loadData() {
        this._isLoading = true;
        this._error = null;
        this.renderComponent();

        try {
            // Load Assignment
            const assignmentResponse = await fetch(`/api/assignments/${this._assignmentId}`);
            if (!assignmentResponse.ok) {
                throw new Error(`Failed to load assignment: ${assignmentResponse.status}`);
            }
            this._assignment = await assignmentResponse.json();

            // Load Shift
            this._shift = await loadShiftDetailed(this._assignment.shift);

            // Load Role Name
            const roleNames = await this.roleMapper.mapRoleIdsToNames([this._assignment.role]);
            this._roleName = roleNames.length > 0 ? roleNames[0] : "Unknown Role";

            // Load Employee
            const employee = (await fetch(`/api/employees/${this._assignment.employee}`)).json;
            this._employeeName = employee?.name || "Unknown Employee";

        } catch (err) {
            console.error(err);
            this._error = "Failed to load shift or assignment details.";
            this._assignment = null;
            this._shift = null;
            this._roleName = null;
        } finally {
            this._isLoading = false;
            this.renderComponent();
        }
    }

    async authenticateEmployee() {
        if (!this._assignment || !this._passwordInput) {
            this._authError = "Please enter your password.";
            this.renderComponent();
            return;
        }

        try {
            const hashedPassword = await hashPassword(this._passwordInput);
            const response = await fetch(`/api/employees/${this._assignment.employee}/verify-password/${hashedPassword}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Incorrect password.');
            }

            this._isAuthenticated = true;
            this._authError = null;
            this.renderComponent();
        } catch (err) {
            this._authError = err.message;
            this._isAuthenticated = false;
            this.renderComponent();
        }

        async function hashPassword(password: string): Promise<string> {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }
        
    }

    async updateAssignmentStatus(confirmed: boolean) {
        if (!this._assignment || this._isUpdating) {
            return;
        }

        this._isUpdating = true;
        this._error = null;
        this.renderComponent();

        try {
            let response;
            if (confirmed) {
                response = await fetch(`/api/mail/confirm/${this._assignment.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                response = await fetch(`/api/mail/decline/${this._assignment.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }

            const updatedAssignment: Assignment = await response.json();
            this._assignment = updatedAssignment;

        } catch (err) {
            console.error(err);
            this._error = `Failed to update assignment: ${err.message}`;
        } finally {
            this._isUpdating = false;
            this.renderComponent();
        }
    }

    getConfirmationStatus(confirmed: boolean | null): { text: string; cssClass: string } {
        if (confirmed === true) {
            return { text: "Confirmed", cssClass: "has-text-success" };
        } else if (confirmed === false) {
            return { text: "Declined", cssClass: "has-text-danger" };
        } else {
            return { text: "Pending Confirmation", cssClass: "has-text-warning" };
        }
    }

    renderComponent() {
        render(this.template(), this.shadowRoot);
    }

    template() {
        if (this._isLoading) {
            return html`<div class="container"><p class="has-text-info">Loading...</p></div>`;
        }

        if (this._error) {
            return html`<div class="container"><div class="notification is-danger">${this._error}</div></div>`;
        }

        if (!this._shift || !this._assignment) {
            return html`<div class="container"><p>No shift details available.</p></div>`;
        }

        if (!this._isAuthenticated) {
            return html`
                <div class="container">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title">
                                Employee Login
                            </p>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <p>Please enter your password:</p>
                                <input class="input" type="password" 
                                    .value=${this._passwordInput} 
                                    @input=${(e: Event) => this._passwordInput = (e.target as HTMLInputElement).value}
                                    placeholder="Password">
                                ${this._authError ? html`<p class="has-text-danger">${this._authError}</p>` : nothing}
                            </div>
                        </div>
                        <footer class="card-footer">
                            <button class="card-footer-item button is-primary" @click=${() => this.authenticateEmployee()}>
                                Submit
                            </button>
                        </footer>
                    </div>
                </div>
            `;
        }

        const shiftStart = DateTime.fromISO(this._shift.startTime);
        const shiftEnd = DateTime.fromISO(this._shift.endTime);
        const formattedDate = shiftStart.hasSame(shiftEnd, "day")
            ? `${shiftStart.toLocaleString(DateTime.DATE_HUGE)} (${shiftStart.toFormat("HH:mm")} - ${shiftEnd.toFormat("HH:mm")})`
            : `${shiftStart.toLocaleString(DateTime.DATE_MED)} ${shiftStart.toFormat("HH:mm")} - ${shiftEnd.toLocaleString(DateTime.DATE_MED)} ${shiftEnd.toFormat("HH:mm")}`;

        const status = this.getConfirmationStatus(this._assignment.confirmed);
        const canConfirmDecline = this._assignment.confirmed === null && !this._isUpdating;

        return html`
            <div class="container">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Shift Confirmation: ${this._shift.company_name || 'Shift'}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p><strong>Date & Time:</strong> <time>${formattedDate}</time></p>
                            <p><strong>Role:</strong> ${this._roleName}</p>
                            <p><strong>Status:</strong> <span class="${status.cssClass}">${status.text}</span></p>
                        </div>
                    </div>
                    
                        <footer class="card-footer">
                            <button class="card-footer-item button ${this._assignment.confirmed === true ? 'is-light' : 'is-success'}" @click=${() => this.updateAssignmentStatus(true)}>Confirm</button>
                            <button class="card-footer-item button ${this._assignment.confirmed === false ? 'is-light' : 'is-danger'}" @click=${() => this.updateAssignmentStatus(false)}>Decline</button>
                        </footer>
                </div>
            </div>
        `;
    }
}

customElements.define("shift-confirmation-component", ShiftConfirmationComponent);
