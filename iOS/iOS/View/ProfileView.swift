//
//  ProfileView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct ProfileView: View {
    @ObservedObject var roleViewModel: RoleViewModel  // Verwende @ObservedObject
    @EnvironmentObject var session: SessionManager

    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var email: String = ""
    @State private var telephone: String = ""
    @State private var birthdate: String = ""
    @State private var companyName: String = ""
    @State private var isEditing: Bool = false

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
                            if isEditing {
                                TextField("First Name", text: $firstName)
                                    .foregroundColor(.primary)
                            } else {
                                Text(firstName)
                                    .foregroundColor(.gray)
                            }
                        }
                        HStack {
                            Text("Last Name:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            if isEditing {
                                TextField("Last Name", text: $lastName)
                                    .foregroundColor(.primary)
                            } else {
                                Text(lastName)
                                    .foregroundColor(.gray)
                            }
                        }
                        HStack {
                            Text("Email:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            if isEditing {
                                TextField("Email", text: $email)
                                    .foregroundColor(.primary)
                            } else {
                                Text(email)
                                    .foregroundColor(.gray)
                            }
                        }
                        HStack {
                            Text("Telephone:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            if isEditing {
                                TextField("Telephone", text: $telephone)
                                    .foregroundColor(.primary)
                            } else {
                                Text(telephone)
                                    .foregroundColor(.gray)
                            }
                        }
                        HStack {
                            Text("Birthdate:")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            if isEditing {
                                TextField("Birthdate", text: $birthdate)
                                    .foregroundColor(.primary)
                            } else {
                                Text(birthdate)
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                    Section(header: Text("Company")) {
                        HStack {
                            Text("Company Name: ")
                                .frame(width: 120, alignment: .leading)
                            Spacer()
                            if isEditing {
                                TextField("Company Name", text: $companyName)
                                    .foregroundColor(.primary)
                            } else {
                                Text(companyName)
                                    .foregroundColor(.gray)
                            }
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
                    Section {
                        HStack {
                            Button(isEditing ? "Save" : "Edit data") {
                                isEditing.toggle()
                            }
                            .frame(maxWidth: .infinity, alignment: .center)
                            .buttonStyle(.borderedProminent)
                            .padding(.top)
                        }
                    }
                }            }
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
    ProfileView(roleViewModel: RoleViewModel())
        .environmentObject(SessionManager())
}
