//
//  ContentView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

@MainActor
class SessionManager: ObservableObject {
    @Published var isLoggedIn = false
    @Published var companyId: Int64? = nil
    @Published var employeeId: Int64? = nil
    @Published var employee: Employee? = nil
    @Published var accessToken: String? = nil
    
    func loadCurrentUser() async {
        guard let token = accessToken else { return }

        // Decode JWT locally to get sub
        let parts = token.split(separator: ".")
        guard parts.count > 1 else { return }

        let payload = parts[1]
        var padded = String(payload)
        while padded.count % 4 != 0 {
            padded += "="
        }

        guard let data = Data(base64Encoded: padded),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let sub = json["sub"] as? String else { return }

        guard let url = URL(string: "http://localhost:8080/api/\($companyId)/employees/keycloak/\(sub)") else { return }

        do {
            let data = try await APIClient.shared.request(url: url)
            let decoded = try JSONDecoder().decode(Employee.self, from: data)

            DispatchQueue.main.async {
                self.employee = decoded
                self.companyId = decoded.companyId
                self.employeeId = decoded.id
                self.isLoggedIn = true
            }

        } catch {
            print("Failed to load current user:", error)
        }
    }
}

struct ContentView: View {
    @StateObject private var session = SessionManager()

    var body: some View {
        Group {
            if session.isLoggedIn {
                MainTabView()
                    .environmentObject(session)
            } else {
                LoginView()
                    .environmentObject(session)
            }
        }
        .onAppear {
            APIClient.shared.sessionManager = session
        }
    }
}

#Preview {
    ContentView()
}
