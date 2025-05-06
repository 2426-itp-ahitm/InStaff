//
//  LoginView.swift
//  iOS
//
//  Created by Alexander Hahn on 06.05.25.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var session: SessionManager
    @State private var employeeIdInput = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("Anmelden")
                .font(.largeTitle)
                .bold()

            TextField("Mitarbeiter-ID eingeben", text: $employeeIdInput)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 40)

            Button("Login") {
                if let id = Int(employeeIdInput) {
                    session.employeeId = id
                    session.isLoggedIn = true
                }
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
    }
}

#Preview {
    LoginView()
}
