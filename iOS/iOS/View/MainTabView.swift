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
    @StateObject private var employeeViewModelHolder = ViewModelHolder<EmployeeViewModel>()
    
    private final class ViewModelHolder<VM: ObservableObject>: ObservableObject {
        @Published var instance: VM?
        func setIfNeeded(_ builder: () -> VM) {
            if instance == nil { instance = builder() }
        }
    }

    var body: some View {
        SwiftUI.TabView {
            SwiftUI.NavigationStack {
                SwiftUI.Group {
                    if let aVM = assignmentViewModelHolder.instance,
                       let rVM = roleViewModelHolder.instance,
                       let sVM = shiftViewModelHolder.instance {
                        HomeView(assignmentViewModel: aVM, roleViewModel: rVM, shiftViewModel: sVM)
                        
                    } else if session.company?.id == nil {
                        
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
            .task {
                if let employeeId = session.employee?.id {
                    assignmentViewModelHolder.setIfNeeded { AssignmentViewModel(employeeId: Int64(employeeId)) }
                    roleViewModelHolder.setIfNeeded { RoleViewModel(companyId: Int64(employeeId)) }
                    shiftViewModelHolder.setIfNeeded { ShiftViewModel(companyId: Int64(employeeId)) }
                    employeeViewModelHolder.setIfNeeded { EmployeeViewModel(companyId: Int64(employeeId)) }
                }
            }
            .tabItem { SwiftUI.Label("Home", systemImage: "house") }
            
            SwiftUI.NavigationStack {
                SwiftUI.Group {
                    if let aVM = assignmentViewModelHolder.instance,
                       let rVM = roleViewModelHolder.instance,
                       let sVM = shiftViewModelHolder.instance {
                        RequestView(
                            assignmentViewModel: aVM,
                            roleViewModel: rVM,
                            shiftViewModel: sVM
                        )
                    } else if session.company?.id == nil {
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
            .task {
                if let employeeId = session.employee?.id {
                    assignmentViewModelHolder.setIfNeeded { AssignmentViewModel(employeeId: Int64(employeeId)) }
                    roleViewModelHolder.setIfNeeded { RoleViewModel(companyId: Int64(employeeId)) }
                    shiftViewModelHolder.setIfNeeded { ShiftViewModel(companyId: Int64(employeeId)) }
                }
            }
            .tabItem { SwiftUI.Label("Alle Dienste", systemImage: "list.bullet.clipboard") }
            
            SwiftUI.NavigationStack {
                SwiftUI.Group {
                    if session.company?.id != nil {
                        if let rVM = roleViewModelHolder.instance,
                           let eVM = employeeViewModelHolder.instance {
                            ProfileView(
                                roleViewModel: rVM,
                                employeeViewModel: eVM
                            )
                        } else {
                            ProgressView("Loading...")
                        }
                        
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
            .tabItem { SwiftUI.Label("Profil", systemImage: "person.circle") }
        }
    }
}

#Preview {
    MainTabView()
        .environmentObject(SessionManager())
}
