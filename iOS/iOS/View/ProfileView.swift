//
//  ProfileView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct ProfileView: View {
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var employeeViewModel: EmployeeViewModel
    @EnvironmentObject var session: SessionManager

    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var email: String = ""
    @State private var telephone: String = ""
    @State private var birthdate: String = ""
    @State private var companyName: String = ""
    @State private var isEditing: Bool = false
    
    private func saveProfileChanges() {
        guard var employee = session.employee else { return }

        let hasChanges =
            employee.firstname != firstName ||
            employee.lastname != lastName ||
            employee.email != email ||
            employee.telephone != telephone ||
            employee.birthdate != birthdate

        if hasChanges {
            employee.firstname = firstName
            employee.lastname = lastName
            employee.email = email
            employee.telephone = telephone
            employee.birthdate = birthdate

            employeeViewModel.saveEmployeeChanges(employee) { result in
                switch result {
                case .success:
                    print("Employee saved successfully")
                    session.employee = employee
                case .failure(let error):
                    print("Failed to save employee: \(error.localizedDescription)")
                }
            }
        } else {
            //print("No changes to save.")
        }
    }

    var body: some View {
        NavigationStack{
            if let employee = session.employee {
                VStack {
                    Form {
                        Section(header: Text("Persönliche Informationen")) {
                            HStack {
                                Text("Vorname:")
                                    .frame(width: 120, alignment: .leading)
                                Spacer()
                                TextField("Vorname", text: $firstName)
                                    .disabled(!isEditing)
                                    .foregroundStyle(isEditing ? .primary : .secondary)
                            }
                            HStack {
                                Text("Nachname:")
                                    .frame(width: 120, alignment: .leading)
                                Spacer()
                                TextField("Nachname", text: $lastName)
                                    .disabled(!isEditing)
                                    .foregroundStyle(isEditing ? .primary : .secondary)
                            }
                            HStack {
                                Text("Email:")
                                    .frame(width: 120, alignment: .leading)
                                Spacer()
                                TextField("Email", text: $email)
                                    .disabled(!isEditing)
                                    .foregroundStyle(isEditing ? .primary : .secondary)
                            }
                            HStack {
                                Text("Telefon:")
                                    .frame(width: 120, alignment: .leading)
                                Spacer()
                                TextField("Telefon", text: $telephone)
                                    .disabled(!isEditing)
                                    .foregroundStyle(isEditing ? .primary : .secondary)
                            }
                            HStack {
                                Text("Geburtstag:")
                                    .frame(width: 120, alignment: .leading)
                                Spacer()
                                TextField("Geburtstag", text: $birthdate)
                                    .disabled(!isEditing)
                                    .foregroundStyle(isEditing ? .primary : .secondary)
                            }
                            Button(action: {
                                if isEditing {
                                    saveProfileChanges()
                                }
                                isEditing.toggle()
                            }) {
                                Text(isEditing ? "Speichern" : "Daten bearbeiten")
                                    .foregroundColor(.white)
                                    .padding()
                                    .frame(maxWidth: .infinity)
                                    .background(Color.appGreen)
                                    .cornerRadius(8)
                            }
                        }
                        Section(header: Text("Firma")) {
                            HStack {
                                Text("Firmenname: ")
                                    .frame(width: 120, alignment: .leading)
                                Spacer()
                                TextField("Firmenname", text: $companyName)
                                    .disabled(true)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Section(header: Text("Rollen")) {
                            ForEach(roleViewModel.roles) { role in
                                HStack {
                                    Text(role.roleName)
                                    Spacer()
                                    if employee.roles.contains(role.id) {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundColor(.green)
                                    } else {
                                        Image(systemName: "circle")
                                            .foregroundColor(.gray)
                                    }
                                }
                            }
                        }
                        Section(header: Text("App Einstellungen")) {
                            Text("Folgt in Kürze :)")
                        }
                        Section(header: Text("")) {
                            Button(action: {
                                session.isLoggedIn = false
                            }) {
                                Text("Logout")
                                    .foregroundColor(.white)
                                    .padding()
                                    .frame(maxWidth: .infinity)
                                    .background(Color(.red))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
                .onAppear {
                    firstName = employee.firstname
                    lastName = employee.lastname
                    email = employee.email
                    telephone = employee.telephone
                    birthdate = employee.birthdate
                    companyName = employee.companyName
                }
            } else {
                VStack {
                    Text("Employee not found")
                }
            }
        }
    }
}
