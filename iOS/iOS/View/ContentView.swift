//
//  ContentView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }
            CalendarView()
                .tabItem { Label("Calendar", systemImage: "calendar") }
            RequestView()
                .tabItem{Label("RequestView", systemImage: "list.bullet.clipboard")}
            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.circle") }
        }
    }
}

#Preview {
    ContentView()
}
