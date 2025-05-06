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
    
    var body: some View {
        if let employee = session.employee {
            let roleNames = getRoleNames(for: employee, from: roleViewModel.roles)
            VStack {
                Form {
                    Section(header: Text("Personal Information")) {
                        HStack {
                            Text("First Name")
                            Spacer()
                            Text(employee.firstname)
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Last Name")
                            Spacer()
                            Text(employee.lastname)
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Email")
                            Spacer()
                            Text(employee.email)
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Telephone")
                            Spacer()
                            Text(employee.telephone)
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Birthdate")
                            Spacer()
                            Text(employee.birthdate)
                                .foregroundColor(.gray)
                        }
                    }
                    Section(header: Text("Company")) {
                        HStack {
                            Text("Company Name")
                            Spacer()
                            Text(employee.company_name)
                                .foregroundColor(.gray)
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
                }
            }
        }
    }
}

#Preview {
    ProfileView(roleViewModel: RoleViewModel())
        .environmentObject(SessionManager())
}
