//
//  LoginView.swift
//  iOS
//
//  Created by Alexander Hahn on 06.05.25.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var session: SessionManager
    
    @StateObject private var companyViewModel = CompanyViewModel()
    @StateObject private var employeeViewModel = EmployeeViewModel(companyId: -1)
    
    @State private var companyNameInput = "Stoaboch Wirt"
    @State private var employeeFirstNameInput = "Alexander"
    @State private var employeeLastNameInput = "Hahn"
    
    @State private var showAlert = false
    @State private var alertMessage = ""


    var body: some View {

        VStack(spacing: 20) {
            Text("Anmelden")
                .font(.largeTitle)
                .bold()

            TextField("Company name", text: $companyNameInput)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 40)
            TextField("Firstname", text: $employeeFirstNameInput)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 40)
            TextField("Lastname", text: $employeeLastNameInput)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 40)
            

            Button("Login") {
                if let matchedCompany = companyViewModel.companies.first(where: { $0.companyName.lowercased() == companyNameInput.lowercased() }) {
                    session.companyId = matchedCompany.id
                    employeeViewModel.updateCompanyId(matchedCompany.id) {
                        print("company id: \(session.companyId)")

                        let id = employeeViewModel.employees.first {
                            $0.firstname.lowercased() == employeeFirstNameInput.lowercased() &&
                            $0.lastname.lowercased() == employeeLastNameInput.lowercased()
                        }?.id ?? -1

                        if id != -1 {
                            session.employeeId = id
                            session.isLoggedIn = true

                            if let matchedEmployee = employeeViewModel.employees.first(where: { $0.id == id }) {
                                session.employee = matchedEmployee
                            }
                        } else {
                            alertMessage = "No matching employee called \(employeeFirstNameInput) \(employeeLastNameInput) found"
                            showAlert = true
                        }
                    }
                } else {
                    alertMessage = "No matching company called \(companyNameInput) found"
                    showAlert = true
                    return
                }
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            .alert(isPresented: $showAlert) {
                Alert(title: Text("Login failed"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
            }
        }
    }
}

#Preview {
    LoginView()
        .environmentObject(SessionManager())
}
