//
//  ProfileView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI
import Combine

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
                    //print("Employee saved successfully")
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
        if let employee = session.employee {
            let roleNames = getRoleNames(for: employee, from: roleViewModel.roles)
            VStack {
                Form {
                    Section(header: Text("Personal Information")) {
                        HStack {
                            Text("First Name:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            TextField("First Name", text: $firstName)
                                .disabled(!isEditing)
                                .foregroundStyle(isEditing ? .primary : .secondary)
                        }
                        HStack {
                            Text("Last Name:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            TextField("Last Name", text: $lastName)
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
                            Text("Telephone:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            TextField("Telephone", text: $telephone)
                                .disabled(!isEditing)
                                .foregroundStyle(isEditing ? .primary : .secondary)
                        }
                        HStack {
                            Text("Birthdate:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            TextField("Birthdate", text: $birthdate)
                                .disabled(!isEditing)
                                .foregroundStyle(isEditing ? .primary : .secondary)
                        }
                    }
                    Section(header: Text("Company")) {
                        HStack {
                            Text("Company Name: ")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            TextField("Company Name", text: $companyName)
                                .disabled(true)
                                .foregroundStyle(.secondary)
                        }
                    }
                    Section(header: Text("Roles")) {
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
                    Section(header: Text("App settings")) {
                        HStack{
                            Text("App settings not implemented yet!")
                        }
                    }
                    Section(header: Text("")) {
                        Button(action: {
                            if isEditing {
                                saveProfileChanges()
                            }
                            isEditing.toggle()
                        }) {
                            Text(isEditing ? "Save" : "Edit data")
                                .foregroundColor(.white)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Color.blue)
                                .cornerRadius(8)
                        }
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
                companyName = employee.company_name
            }
        } else {
            VStack {
                Text("Employee not found")
            }
        }
    }
}

#Preview {
    ProfileView(roleViewModel: RoleViewModel(), employeeViewModel: EmployeeViewModel())
        .environmentObject(SessionManager())
}
