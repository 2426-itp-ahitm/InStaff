//
//  ContentView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

class SessionManager: ObservableObject {
    @Published var isLoggedIn = false
    @Published var companyId: Int? = nil
    @Published var employeeId: Int? = nil
    @Published var employee: Employee? = nil
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
    }
}

#Preview {
    ContentView()
}
