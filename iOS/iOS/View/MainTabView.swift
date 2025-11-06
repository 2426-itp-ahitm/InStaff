//
//  MainTabView.swift
//  iOS
//
//  Created by Alexander Hahn on 06.05.25.
//

import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var session: SessionManager

    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }
            CalendarView()
                .tabItem { Label("Calendar", systemImage: "calendar") }
            RequestView(companyId: session.companyId!)
                .tabItem { Label("RequestView", systemImage: "list.bullet.clipboard") }
            ProfileView(roleViewModel: RoleViewModel(companyId: session.companyId!), employeeViewModel: EmployeeViewModel(companyId: session.companyId!), colorManager: RoleColorManager(roleViewModel: RoleViewModel(companyId: session.companyId!)))
                .tabItem { Label("Profile", systemImage: "person.circle") }
        }
    }
}

#Preview {
    MainTabView()
        .environmentObject(SessionManager())
}
