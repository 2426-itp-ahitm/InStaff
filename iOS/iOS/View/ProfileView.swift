//
//  ProfileView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

final class ProfileCoordinator: ObservableObject {
    @Published var hasUnsavedChanges = false
    @Published private(set) var saveTrigger = 0
    @Published private(set) var discardTrigger = 0

    var afterSuccessfulSave: (() -> Void)?

    func requestSave() {
        saveTrigger += 1
    }

    func requestDiscard() {
        discardTrigger += 1
        hasUnsavedChanges = false
    }
}

struct ProfileView: View {
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var employeeViewModel: EmployeeViewModel
    @ObservedObject var coordinator: ProfileCoordinator
    @EnvironmentObject var session: SessionManager

    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var email: String = ""
    @State private var telephone: String = ""
    @State private var address: String = ""
    @State private var selectedBirthDate: Date = Date()
    @State private var isEditing: Bool = false
    @State private var showDiscardAlert = false
    @State private var showLogoutConfirmation = false
    @State private var showUnsavedLogoutAlert = false
    @State private var saveErrorMessage: String?
    
    private func saveProfileChanges(onSuccess: (() -> Void)? = nil) {
        guard var employee = session.employee else { return }

        let hasChanges =
            employee.firstname != firstName ||
            employee.lastname != lastName ||
            employee.telephone != telephone ||
            employee.birthDate != DateUtils.toApiBirthDate(selectedBirthDate) ||
            employee.address != address

        guard validate() else {
            return
        }

        if hasChanges {
            employee.firstname = firstName
            employee.lastname = lastName
            employee.telephone = telephone
            employee.birthDate = DateUtils.toApiBirthDate(selectedBirthDate)
            employee.address = address

            employeeViewModel.saveEmployeeChanges(employee) { result in
                switch result {
                case .success:
                    session.employee = employee
                    isEditing = false
                    saveErrorMessage = nil
                    coordinator.hasUnsavedChanges = false
                    onSuccess?()
                case .failure(let error):
                    saveErrorMessage = error.localizedDescription
                }
            }
        } else {
            isEditing = false
            coordinator.hasUnsavedChanges = false
            onSuccess?()
        }
    }

    var body: some View {
        if let employee = session.employee {
            Form {
                Section("Persönliche Informationen") {
                    LabeledContent("Vorname") {
                        TextField("Vorname", text: $firstName)
                            .multilineTextAlignment(.trailing)
                            .disabled(!isEditing)
                    }
                    LabeledContent("Nachname") {
                        TextField("Nachname", text: $lastName)
                            .multilineTextAlignment(.trailing)
                            .disabled(!isEditing)
                    }
                    LabeledContent("E-Mail") {
                        Text(email)
                            .foregroundStyle(.secondary)
                    }
                    LabeledContent("Telefon") {
                        TextField("Telefon", text: $telephone)
                            .multilineTextAlignment(.trailing)
                            .disabled(!isEditing)
                    }
                    LabeledContent("Geburtsdatum") {
                        if isEditing {
                            DatePicker(
                                "",
                                selection: $selectedBirthDate,
                                in: ...Date(),
                                displayedComponents: .date
                            )
                            .labelsHidden()
                        } else {
                            let formatted = DateUtils.formatBirthDate(DateUtils.toApiBirthDate(selectedBirthDate))
                            Text(formatted)
                                .foregroundStyle(.secondary)
                        }
                    }
                    LabeledContent("Adresse") {
                        TextField("Adresse", text: $address)
                            .multilineTextAlignment(.trailing)
                            .disabled(!isEditing)
                    }
                    if let saveErrorMessage {
                        Text(saveErrorMessage)
                            .foregroundStyle(.red)
                    }
                    if isEditing {
                        Text("Bearbeitungsmodus aktiv. Du kannst deine persönlichen Daten jetzt ändern.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }
                Section {
                    if isEditing {
                        Button(action: { saveProfileChanges() }) {
                            Text("Speichern")
                        }
                        .foregroundColor(.white)
                        .listRowBackground(Color.appGreen)

                        Button("Verwerfen", role: .destructive) {
                            if hasUnsavedChanges {
                                showDiscardAlert = true
                            } else {
                                resetForm(with: employee)
                                isEditing = false
                            }
                        }
                    } else {
                        Button(action: { isEditing = true }) {
                            Text("Daten bearbeiten")
                        }
                        .foregroundColor(.white)
                        .listRowBackground(Color.appGreen)
                    }
                }
                Section("Firma") {
                    LabeledContent("Firmenname") {
                        Text(employee.company?.companyName ?? "-")
                            .foregroundStyle(.secondary)
                    }
                    LabeledContent("Stundenlohn") {
                        Text("\(DateUtils.formatHourlyWage(employee.hourlyWage)) EUR / Stunde")
                            .foregroundStyle(.secondary)
                    }
                    LabeledContent("Manager-Status") {
                        Text(employee.isManager ? "Ja" : "Nein")
                            .foregroundStyle(.secondary)
                    }
                }
                Section("Rollen") {
                    if employee.roles.isEmpty {
                        Text("Keine Rollen")
                            .foregroundColor(.gray)
                    } else {
                        ForEach(employee.roles) { role in
                            NavigationLink {
                                RoleDetailView(role: role)
                            } label: {
                                HStack {
                                    Text(role.roleName)
                                }
                            }
                        }
                    }
                }
                Section {
                    Button("Logout", role: .destructive) {
                        if hasUnsavedChanges {
                            showUnsavedLogoutAlert = true
                        } else {
                            showLogoutConfirmation = true
                        }
                    }
                }
            }
            .onAppear {
                resetForm(with: employee)
            }
            .onChange(of: session.employee) { _, updatedEmployee in
                if let updatedEmployee {
                    resetForm(with: updatedEmployee)
                }
            }
            .onChange(of: firstName) { _, _ in syncUnsavedChanges(employee) }
            .onChange(of: lastName) { _, _ in syncUnsavedChanges(employee) }
            .onChange(of: telephone) { _, _ in syncUnsavedChanges(employee) }
            .onChange(of: address) { _, _ in syncUnsavedChanges(employee) }
            .onChange(of: selectedBirthDate) { _, _ in syncUnsavedChanges(employee) }
            .onChange(of: coordinator.saveTrigger) { _, _ in
                saveProfileChanges {
                    coordinator.afterSuccessfulSave?()
                    coordinator.afterSuccessfulSave = nil
                }
            }
            .onChange(of: coordinator.discardTrigger) { _, _ in
                resetForm(with: employee)
                isEditing = false
            }
            .alert("Änderungen verwerfen?", isPresented: $showDiscardAlert) {
                Button("Verwerfen", role: .destructive) {
                    resetForm(with: employee)
                    isEditing = false
                }
                Button("Abbrechen", role: .cancel) {}
            } message: {
                Text("Speichere deine Änderungen bevor du die Seite wechselst.")
            }
            .alert("Ungespeicherte Änderungen", isPresented: $showUnsavedLogoutAlert) {
                Button("Speichern") {
                    saveProfileChanges {
                        showLogoutConfirmation = true
                    }
                }
                Button("Verwerfen", role: .destructive) {
                    session.isLoggedIn = false
                    session.accessToken = nil
                }
                Button("Abbrechen", role: .cancel) {}
            } message: {
                Text("Speichere deine Änderungen bevor du dich abmeldest.")
            }
            .alert("Wirklich abmelden?", isPresented: $showLogoutConfirmation) {
                Button("Logout", role: .destructive) {
                    session.isLoggedIn = false
                    session.accessToken = nil
                }
                Button("Abbrechen", role: .cancel) {}
            } message: {
                Text("Möchtest du dich wirklich abmelden?")
            }
        } else {
            VStack {
                Text("Employee not found")
            }
        }
    }

    private var hasUnsavedChanges: Bool {
        coordinator.hasUnsavedChanges
    }

    private func validate() -> Bool {
        !firstName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !lastName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !telephone.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !address.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func resetForm(with employee: Employee) {
        firstName = employee.firstname
        lastName = employee.lastname
        email = employee.email
        telephone = employee.telephone
        address = employee.address
        selectedBirthDate = DateUtils.parseBirthDate(employee.birthDate) ?? Date()
        saveErrorMessage = nil
        coordinator.hasUnsavedChanges = false
    }

    private func syncUnsavedChanges(_ employee: Employee) {
        guard isEditing else {
            coordinator.hasUnsavedChanges = false
            return
        }

        coordinator.hasUnsavedChanges =
            firstName != employee.firstname ||
            lastName != employee.lastname ||
            telephone != employee.telephone ||
            address != employee.address ||
            DateUtils.toApiBirthDate(selectedBirthDate) != employee.birthDate
    }
}

