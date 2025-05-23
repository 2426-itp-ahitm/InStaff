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
            RequestView()
                .tabItem { Label("RequestView", systemImage: "list.bullet.clipboard") }
            ProfileView(roleViewModel: RoleViewModel(), employeeViewModel: EmployeeViewModel())
                .tabItem { Label("Profile", systemImage: "person.circle") }
        }
    }
}

#Preview {
    MainTabView()
        .environmentObject(SessionManager())
}
