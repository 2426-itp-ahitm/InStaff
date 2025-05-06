//
//  LoginView.swift
//  iOS
//
//  Created by Alexander Hahn on 06.05.25.
//

import SwiftUI

struct LoginView: View {
    @StateObject private var employeeViewModel = EmployeeViewModel()

    @EnvironmentObject var session: SessionManager
    
    @State private var employeeFirstNameInput = ""
    @State private var employeeLastNameInput = ""
    
    @State private var showAlert = false
    @State private var alertMessage = ""


    var body: some View {
        VStack(spacing: 20) {
            Text("Anmelden")
                .font(.largeTitle)
                .bold()

            TextField("Firstname", text: $employeeFirstNameInput)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 40)
            TextField("Lastname", text: $employeeLastNameInput)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 40)
            

            Button("Login") {
                let id = employeeViewModel.employees.first {
                    $0.firstname.lowercased() == employeeFirstNameInput.lowercased() && $0.lastname.lowercased() == employeeLastNameInput.lowercased()
                }?.id ?? -1
                if id != -1 {
                    session.employeeId = id
                    session.isLoggedIn = true
                } else {
                    alertMessage = "No matching employee called \(employeeFirstNameInput) \(employeeLastNameInput) found"
                    showAlert = true
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
