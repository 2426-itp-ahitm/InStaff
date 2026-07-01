import {Component, ElementRef, OnInit, QueryList, ViewChildren, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {CompanySetupService} from '../company-setup-service/company-setup.service';
import {
  CompanySetupComplete,
  CompanySetupEmployee,
  CompanySetupOpeningHour,
  CompanySetupRole,
  CompanySetupShiftTemplate,
  CompanySetupTemplateRole
} from '../../interfaces/company-setup';

type WizardStep = 'company' | 'owner' | 'openingHours' | 'roles' | 'shiftTemplates' | 'employees' | 'legal' | 'summary';

interface WizardStepConfig {
  id: WizardStep;
  label: string;
  optional: boolean;
}

@Component({
  selector: 'app-company-setup-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './company-setup-page.component.html',
  styleUrl: './company-setup-page.component.css'
})
export class CompanySetupPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private companySetupService = inject(CompanySetupService);

  token = '';
  loading = true;
  tokenValid = false;
  loggedIn = false;
  completed = false;
  submitting = false;
  errorMessage = '';
  setupSessionToken = '';
  setupSessionExpiresAt = '';
  reviewConfirmed = false;

  readonly sessionStoragePrefix = 'instaff-company-setup-session';
  readonly steps: WizardStepConfig[] = [
    {id: 'company', label: 'Unternehmen', optional: false},
    {id: 'owner', label: 'Manager', optional: false},
    {id: 'openingHours', label: 'Öffnungszeiten', optional: false},
    {id: 'roles', label: 'Rollen', optional: true},
    {id: 'shiftTemplates', label: 'Schichtvorlagen', optional: true},
    {id: 'employees', label: 'Mitarbeiter', optional: true},
    {id: 'legal', label: 'Rechtliches', optional: false},
    {id: 'summary', label: 'Zusammenfassung', optional: false}
  ];
  currentStepIndex = 0;

  readonly weekdays = [
    {value: 'MONDAY', label: 'Montag'},
    {value: 'TUESDAY', label: 'Dienstag'},
    {value: 'WEDNESDAY', label: 'Mittwoch'},
    {value: 'THURSDAY', label: 'Donnerstag'},
    {value: 'FRIDAY', label: 'Freitag'},
    {value: 'SATURDAY', label: 'Samstag'},
    {value: 'SUNDAY', label: 'Sonntag'}
  ];
  readonly timeOptions = this.buildTimeOptions();
  readonly passwordCodeIndexes = Array.from({length: 8}, (_, index) => index);

  roles: CompanySetupRole[] = [];
  shiftTemplates: CompanySetupShiftTemplate[] = [];
  employees: CompanySetupEmployee[] = [];
  pendingTemplateRoles: CompanySetupTemplateRole[] = [];
  selectedEmployeeRoleNames: string[] = [];

  passwordForm = new FormGroup({
    code0: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code1: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code2: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code3: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code4: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code5: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code6: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    code7: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  @ViewChildren('setupPasswordInput') setupPasswordInputs!: QueryList<ElementRef<HTMLInputElement>>;

  companyForm = new FormGroup({
    companyName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    uidNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    publicEmail: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    publicTelephone: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    address: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    locationName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    contactPersonName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    contactPersonEmail: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    contactPersonTelephone: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  ownerForm = new FormGroup({
    firstname: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    lastname: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    telephone: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    birthdate: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    hourlyWage: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    address: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  openingHoursForm = new FormGroup({
    openingHours: new FormArray<FormGroup>([])
  });

  roleForm = new FormGroup({
    roleName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    description: new FormControl('', {nonNullable: true})
  });

  shiftTemplateForm = new FormGroup({
    shiftTemplateName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    roleName: new FormControl('', {nonNullable: true}),
    count: new FormControl(1, {nonNullable: true, validators: [Validators.min(1)]})
  });

  employeeForm = new FormGroup({
    firstname: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    lastname: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    telephone: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    birthdate: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    hourlyWage: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    address: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    isManager: new FormControl(false, {nonNullable: true}),
    isActive: new FormControl(true, {nonNullable: true}),
    isSelfManaged: new FormControl(false, {nonNullable: true})
  });

  legalForm = new FormGroup({
    dataIsCorrect: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]}),
    authorizedToRegisterCompany: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]}),
    acceptedPrivacyPolicy: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]}),
    acceptedTerms: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]})
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.initOpeningHours();

    if (!this.token) {
      this.loading = false;
      this.errorMessage = 'Setup-Link ist ungültig.';
      return;
    }

    this.validateToken();
  }

  get currentStep(): WizardStepConfig {
    return this.steps[this.currentStepIndex];
  }

  get progressPercent(): number {
    return Math.round(((this.currentStepIndex + 1) / this.steps.length) * 100);
  }

  get openingHourControls(): FormGroup[] {
    return this.openingHoursForm.controls.openingHours.controls;
  }

  validateToken(): void {
    this.companySetupService.validateToken(this.token).subscribe({
      next: response => {
        this.tokenValid = response.valid;
        this.companyForm.controls.companyName.setValue(response.preliminaryCompanyName || '');
        this.restoreSession();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.tokenValid = false;
        this.errorMessage = this.readErrorMessage(error, 'Dieser Setup-Link ist nicht mehr gültig.');
      }
    });
  }

  login(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.companySetupService.login(this.token, this.getSetupPassword()).subscribe({
      next: session => {
        this.setupSessionToken = session.setupSessionToken;
        this.setupSessionExpiresAt = session.expiresAt;
        this.loggedIn = true;
        sessionStorage.setItem(this.sessionStorageKey(), JSON.stringify(session));
      },
      error: error => {
        this.errorMessage = this.readErrorMessage(error, 'Passwort ist ungültig oder der Setup-Zugang ist gesperrt.');
      }
    });
  }

  onPasswordInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^a-zA-Z0-9]/g, '').slice(-1).toUpperCase();
    const control = this.passwordForm.get(this.passwordControlName(index));

    control?.setValue(value);
    input.value = value;

    if (value && index < this.passwordCodeIndexes.length - 1) {
      this.focusPasswordInput(index + 1);
    }
  }

  onPasswordKeydown(event: KeyboardEvent, index: number): void {
    const control = this.passwordForm.get(this.passwordControlName(index));

    if (event.key !== 'Backspace') {
      return;
    }

    if (control?.value) {
      control.setValue('');
      return;
    }

    if (index > 0) {
      event.preventDefault();
      const previousControl = this.passwordForm.get(this.passwordControlName(index - 1));
      previousControl?.setValue('');
      this.focusPasswordInput(index - 1);
    }
  }

  onPasswordPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedValue = event.clipboardData
      ?.getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
      .toUpperCase() || '';

    this.passwordCodeIndexes.forEach(index => {
      this.passwordForm.get(this.passwordControlName(index))?.setValue(pastedValue[index] || '');
    });

    const nextEmptyIndex = this.passwordCodeIndexes.find(index => !this.passwordForm.get(this.passwordControlName(index))?.value);
    this.focusPasswordInput(nextEmptyIndex ?? 7);
  }

  nextStep(): void {
    if (!this.isCurrentStepValid()) {
      return;
    }

    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  goToStep(index: number): void {
    if (index <= this.currentStepIndex) {
      this.currentStepIndex = index;
    }
  }

  addRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const roleName = this.roleForm.controls.roleName.value.trim();

    if (this.roles.some(role => role.roleName.toLowerCase() === roleName.toLowerCase())) {
      this.errorMessage = 'Diese Rolle wurde bereits hinzugefügt.';
      return;
    }

    this.roles = [
      ...this.roles,
      {
        roleName,
        description: this.roleForm.controls.description.value.trim()
      }
    ];
    this.errorMessage = '';
    this.roleForm.reset({roleName: '', description: ''});
  }

  removeRole(roleName: string): void {
    this.roles = this.roles.filter(role => role.roleName !== roleName);
    this.pendingTemplateRoles = this.pendingTemplateRoles.filter(templateRole => templateRole.roleName !== roleName);
    this.shiftTemplates = this.shiftTemplates.map(template => ({
      ...template,
      templateRoles: template.templateRoles.filter(templateRole => templateRole.roleName !== roleName)
    }));
    this.employees = this.employees.map(employee => ({
      ...employee,
      roleNames: employee.roleNames.filter(employeeRoleName => employeeRoleName !== roleName)
    }));
    this.selectedEmployeeRoleNames = this.selectedEmployeeRoleNames.filter(selectedRole => selectedRole !== roleName);
  }

  addTemplateRole(): void {
    const roleName = this.shiftTemplateForm.controls.roleName.value;
    const count = Number(this.shiftTemplateForm.controls.count.value);

    if (!roleName || count <= 0) {
      this.shiftTemplateForm.markAllAsTouched();
      this.errorMessage = 'Bitte wähle eine Rolle und eine gültige Anzahl aus.';
      return;
    }

    const existingRole = this.pendingTemplateRoles.find(templateRole => templateRole.roleName === roleName);
    if (existingRole) {
      existingRole.count = count;
      this.pendingTemplateRoles = [...this.pendingTemplateRoles];
    } else {
      this.pendingTemplateRoles = [...this.pendingTemplateRoles, {roleName, count}];
    }

    this.errorMessage = '';
    this.shiftTemplateForm.patchValue({roleName: '', count: 1});
  }

  removeTemplateRole(roleName: string): void {
    this.pendingTemplateRoles = this.pendingTemplateRoles.filter(templateRole => templateRole.roleName !== roleName);
  }

  addShiftTemplate(): void {
    if (this.shiftTemplateForm.controls.shiftTemplateName.invalid) {
      this.shiftTemplateForm.controls.shiftTemplateName.markAsTouched();
      return;
    }

    const shiftTemplateName = this.shiftTemplateForm.controls.shiftTemplateName.value.trim();
    this.shiftTemplates = [
      ...this.shiftTemplates,
      {
        shiftTemplateName,
        templateRoles: this.pendingTemplateRoles
      }
    ];
    this.pendingTemplateRoles = [];
    this.shiftTemplateForm.reset({shiftTemplateName: '', roleName: '', count: 1});
  }

  removeShiftTemplate(index: number): void {
    this.shiftTemplates = this.shiftTemplates.filter((_, currentIndex) => currentIndex !== index);
  }

  addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.employees = [
      ...this.employees,
      {
        firstname: this.employeeForm.controls.firstname.value.trim(),
        lastname: this.employeeForm.controls.lastname.value.trim(),
        email: this.employeeForm.controls.email.value.trim(),
        telephone: this.employeeForm.controls.telephone.value.trim(),
        birthdate: this.employeeForm.controls.birthdate.value,
        roleNames: this.getSelectedEmployeeRoleNames(),
        hourlyWage: Number(this.employeeForm.controls.hourlyWage.value),
        address: this.employeeForm.controls.address.value.trim(),
        isManager: this.employeeForm.controls.isManager.value,
        isActive: this.employeeForm.controls.isActive.value,
        isSelfManaged: this.employeeForm.controls.isSelfManaged.value
      }
    ];

    this.employeeForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      telephone: '',
      birthdate: '',
      hourlyWage: 0,
      address: '',
      isManager: false,
      isActive: true,
      isSelfManaged: false
    });
    this.selectedEmployeeRoleNames = [];
  }

  removeEmployee(index: number): void {
    this.employees = this.employees.filter((_, currentIndex) => currentIndex !== index);
  }

  submitSetup(): void {
    if (!this.isCurrentStepValid() || !this.reviewConfirmed) {
      this.errorMessage = 'Bitte bestätige die Zusammenfassung vor dem Abschluss.';
      return;
    }

    if (!this.setupSessionToken || this.isSessionExpired()) {
      this.loggedIn = false;
      this.clearSession();
      this.errorMessage = 'Deine Setup-Session ist abgelaufen. Bitte melde dich erneut mit dem Setup-Passwort an.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.companySetupService.completeSetup(this.setupSessionToken, this.buildSetupPayload()).subscribe({
      next: () => {
        this.submitting = false;
        this.completed = true;
        this.clearSession();
      },
      error: error => {
        this.submitting = false;
        this.errorMessage = this.readErrorMessage(error, 'Setup konnte nicht abgeschlossen werden.');
      }
    });
  }

  hasFieldError(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    return !!control && control.invalid && control.touched;
  }

  isEmployeeRoleSelected(roleName: string): boolean {
    return this.selectedEmployeeRoleNames.includes(roleName);
  }

  toggleEmployeeRole(roleName: string, checked: boolean): void {
    if (checked && !this.selectedEmployeeRoleNames.includes(roleName)) {
      this.selectedEmployeeRoleNames = [...this.selectedEmployeeRoleNames, roleName];
      return;
    }

    if (!checked) {
      this.selectedEmployeeRoleNames = this.selectedEmployeeRoleNames.filter(selectedRole => selectedRole !== roleName);
    }
  }

  toggleClosed(openingHour: FormGroup): void {
    const isClosed = openingHour.get('isClosed')?.value === true;

    if (isClosed) {
      openingHour.patchValue({startTime: null, endTime: null});
    } else if (!openingHour.get('startTime')?.value || !openingHour.get('endTime')?.value) {
      openingHour.patchValue({startTime: '09:00', endTime: '17:00'});
    }
  }

  private initOpeningHours(): void {
    const openingHours = this.openingHoursForm.controls.openingHours;
    openingHours.clear();

    this.weekdays.forEach(day => {
      openingHours.push(new FormGroup({
        weekday: new FormControl(day.value, {nonNullable: true}),
        isClosed: new FormControl(false, {nonNullable: true}),
        startTime: new FormControl('09:00'),
        endTime: new FormControl('17:00')
      }));
    });
  }

  private isCurrentStepValid(): boolean {
    if (this.currentStep.id === 'company') {
      return this.markAndCheck(this.companyForm);
    }

    if (this.currentStep.id === 'owner') {
      return this.markAndCheck(this.ownerForm);
    }

    if (this.currentStep.id === 'openingHours') {
      this.openingHoursForm.markAllAsTouched();
      const invalidOpeningHour = this.openingHourControls.some(openingHour => {
        const isClosed = openingHour.get('isClosed')?.value === true;
        const startTime = openingHour.get('startTime')?.value;
        const endTime = openingHour.get('endTime')?.value;

        return !isClosed && (!startTime || !endTime || String(startTime) >= String(endTime));
      });

      if (invalidOpeningHour) {
        this.errorMessage = 'Offene Tage brauchen eine gültige Start- und Endzeit.';
        return false;
      }

      this.errorMessage = '';
      return true;
    }

    if (this.currentStep.id === 'legal') {
      return this.markAndCheck(this.legalForm);
    }

    return true;
  }

  private markAndCheck(form: FormGroup): boolean {
    form.markAllAsTouched();
    const valid = form.valid;

    if (!valid) {
      this.errorMessage = 'Bitte fülle alle Pflichtfelder korrekt aus.';
    } else {
      this.errorMessage = '';
    }

    return valid;
  }

  private buildSetupPayload(): CompanySetupComplete {
    return {
      company: {
        companyName: this.companyForm.controls.companyName.value.trim(),
        uidNumber: this.companyForm.controls.uidNumber.value.trim(),
        publicEmail: this.companyForm.controls.publicEmail.value.trim(),
        publicTelephone: this.companyForm.controls.publicTelephone.value.trim(),
        address: this.companyForm.controls.address.value.trim(),
        locationName: this.companyForm.controls.locationName.value.trim(),
        contactPersonName: this.companyForm.controls.contactPersonName.value.trim(),
        contactPersonEmail: this.companyForm.controls.contactPersonEmail.value.trim(),
        contactPersonTelephone: this.companyForm.controls.contactPersonTelephone.value.trim()
      },
      owner: {
        firstname: this.ownerForm.controls.firstname.value.trim(),
        lastname: this.ownerForm.controls.lastname.value.trim(),
        email: this.ownerForm.controls.email.value.trim(),
        telephone: this.ownerForm.controls.telephone.value.trim(),
        birthdate: this.ownerForm.controls.birthdate.value,
        roleNames: [],
        hourlyWage: Number(this.ownerForm.controls.hourlyWage.value),
        address: this.ownerForm.controls.address.value.trim(),
        isManager: true,
        isActive: true,
        isSelfManaged: true
      },
      openingHours: {
        openingHours: this.openingHourControls.map(openingHour => this.mapOpeningHour(openingHour))
      },
      legalConfirmation: {
        dataIsCorrect: this.legalForm.controls.dataIsCorrect.value,
        authorizedToRegisterCompany: this.legalForm.controls.authorizedToRegisterCompany.value,
        acceptedPrivacyPolicy: this.legalForm.controls.acceptedPrivacyPolicy.value,
        acceptedTerms: this.legalForm.controls.acceptedTerms.value
      },
      roles: this.roles,
      shiftTemplates: this.shiftTemplates,
      employees: this.employees
    };
  }

  private mapOpeningHour(openingHour: FormGroup): CompanySetupOpeningHour {
    const isClosed = openingHour.get('isClosed')?.value === true;
    const startTime = openingHour.get('startTime')?.value;
    const endTime = openingHour.get('endTime')?.value;

    return {
      weekday: String(openingHour.get('weekday')?.value),
      isClosed,
      startTime: isClosed ? null : this.toBackendTime(startTime),
      endTime: isClosed ? null : this.toBackendTime(endTime)
    };
  }

  private toBackendTime(value: unknown): string {
    return `${String(value)}:00`;
  }

  private restoreSession(): void {
    const storedSession = sessionStorage.getItem(this.sessionStorageKey());

    if (!storedSession) {
      return;
    }

    try {
      const session = JSON.parse(storedSession) as {setupSessionToken: string; expiresAt: string; active: boolean};
      this.setupSessionToken = session.setupSessionToken;
      this.setupSessionExpiresAt = session.expiresAt;

      if (session.active && !this.isSessionExpired()) {
        this.loggedIn = true;
        return;
      }
    } catch (ignored) {
    }

    this.clearSession();
  }

  private isSessionExpired(): boolean {
    if (!this.setupSessionExpiresAt) {
      return true;
    }

    return new Date(this.setupSessionExpiresAt).getTime() <= Date.now();
  }

  private clearSession(): void {
    this.setupSessionToken = '';
    this.setupSessionExpiresAt = '';
    sessionStorage.removeItem(this.sessionStorageKey());
  }

  private sessionStorageKey(): string {
    return `${this.sessionStoragePrefix}:${this.token}`;
  }

  private buildTimeOptions(): string[] {
    const options: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (const minute of ['00', '30']) {
        options.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }

    return options;
  }

  private readErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse && typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return fallback;
  }

  private getSetupPassword(): string {
    const passwordParts = this.passwordCodeIndexes.map(index => this.passwordForm.get(this.passwordControlName(index))?.value || '');
    return `${passwordParts.slice(0, 4).join('')}-${passwordParts.slice(4).join('')}`;
  }

  private passwordControlName(index: number): string {
    return `code${index}`;
  }

  private focusPasswordInput(index: number): void {
    queueMicrotask(() => {
      this.setupPasswordInputs?.get(index)?.nativeElement.focus();
    });
  }

  private getSelectedEmployeeRoleNames(): string[] {
    return this.selectedEmployeeRoleNames;
  }
}
