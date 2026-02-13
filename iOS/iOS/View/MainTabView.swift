//
//  MainTabView.swift
//  iOS
//
//  Created by Alexander Hahn on 06.05.25.
//

import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var session: SessionManager

    @StateObject private var assignmentViewModelHolder = ViewModelHolder<AssignmentViewModel>()
    @StateObject private var roleViewModelHolder = ViewModelHolder<RoleViewModel>()
    @StateObject private var shiftViewModelHolder = ViewModelHolder<ShiftViewModel>()
    
    private final class ViewModelHolder<VM: ObservableObject>: ObservableObject {
        @Published var instance: VM?
        func setIfNeeded(_ builder: () -> VM) {
            if instance == nil { instance = builder() }
        }
    }

    var body: some View {
        TabView {
            NavigationStack {
                Group {
                    if let aVM = assignmentViewModelHolder.instance,
                       let rVM = roleViewModelHolder.instance,
                       let sVM = shiftViewModelHolder.instance {
                        HomeView(
                            assignmentViewModel: aVM,
                            roleViewModel: rVM,
                            shiftViewModel: sVM
                        )
                    } else if session.companyId == nil {
                        VStack(spacing: 12) {
                            ProgressView("Loading…")
                            Text("Waiting for company context…")
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    } else {
                        ProgressView("Loading…")
                    }
                }
                .navigationTitle("Home")
            }
            .task(id: session.companyId) {
                if let companyId = session.companyId {
                    assignmentViewModelHolder.setIfNeeded { AssignmentViewModel(companyId: companyId) }
                    roleViewModelHolder.setIfNeeded { RoleViewModel(companyId: companyId) }
                    shiftViewModelHolder.setIfNeeded { ShiftViewModel(companyId: companyId) }
                }
            }
            .tabItem { Label("Home", systemImage: "house") }
            
            NavigationStack {
                CalendarView()
                    .navigationTitle("Kalender")
            }
            .tabItem { Label("Kalender", systemImage: "calendar") }
            
            NavigationStack {
                Group {
                    if let aVM = assignmentViewModelHolder.instance,
                       let rVM = roleViewModelHolder.instance,
                       let sVM = shiftViewModelHolder.instance {
                        RequestView(
                            assignmentViewModel: aVM,
                            roleViewModel: rVM,
                            shiftViewModel: sVM
                        )
                    } else if session.companyId == nil {
                        VStack(spacing: 12) {
                            ProgressView("Loading…")
                            Text("Waiting for company context…")
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    } else {
                        ProgressView("Loading…")
                    }
                }
                .navigationTitle("Alle Dienste")
            }
            .task(id: session.companyId) {
                if let companyId = session.companyId {
                    assignmentViewModelHolder.setIfNeeded { AssignmentViewModel(companyId: companyId) }
                    roleViewModelHolder.setIfNeeded { RoleViewModel(companyId: companyId) }
                    shiftViewModelHolder.setIfNeeded { ShiftViewModel(companyId: companyId) }
                }
            }
            .tabItem { Label("Alle Dienste", systemImage: "list.bullet.clipboard") }
            
            NavigationStack {
                Group {
                    if let companyId = session.companyId {
                        ProfileView(
                            roleViewModel: RoleViewModel(companyId: companyId),
                            employeeViewModel: EmployeeViewModel(companyId: companyId)
                        )
                    } else {
                        VStack(spacing: 12) {
                            ProgressView("Loading…")
                            Text("Waiting for company context…")
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .navigationTitle("Profil")
            }
            .tabItem { Label("Profil", systemImage: "person.circle") }
        }
    }
}

#Preview {
    MainTabView()
        .environmentObject(SessionManager())
}
