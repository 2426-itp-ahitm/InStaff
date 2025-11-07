//
//  RequestView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct RequestView: View {
    @EnvironmentObject var session: SessionManager
    @StateObject var assignmentViewModel: AssignmentViewModel
    @StateObject var roleViewModel: RoleViewModel
    @StateObject var shiftViewModel: ShiftViewModel
    
    @State private var selectedRoleId: Int? = nil
    @State private var filterByUpcomingOnly = false

    init(companyId: Int) {
        _assignmentViewModel = StateObject(wrappedValue: AssignmentViewModel(companyId: companyId))
        _roleViewModel = StateObject(wrappedValue: RoleViewModel(companyId: companyId))
        _shiftViewModel = StateObject(wrappedValue: ShiftViewModel(companyId: companyId))
    }
    
    var filteredAssignments: [Assignment] {
        assignmentViewModel.assignments
            .filter { $0.employee == session.employeeId }
            .filter { assignment in
                if let selectedRoleId = selectedRoleId {
                    return assignment.role == selectedRoleId
                }
                return true
            }
            .sorted { l, r in
                guard let lShift = shiftViewModel.shift(for: l.shift),
                      let rShift = shiftViewModel.shift(for: r.shift) else {
                    return false
                }
                return lShift.startTime > rShift.startTime
            }
    }

    var body: some View {
        VStack{
            NavigationSplitView {
                Menu("Filter") {
                    Picker("Rolle", selection: $selectedRoleId) {
                        Text("Alle Rollen").tag(Int?.none)
                        ForEach(roleViewModel.roles) { role in
                            if let employee = session.employee, employee.roles.contains(role.id) {
                                Text(roleViewModel.roleName(for: role.id)).tag(Optional(role.id))
                            }
                        }
                    }
                }
                .padding()
                List {
                    ForEach(filteredAssignments) { assignment in
                        NavigationLink {
                            RequestDetailView(
                                roleViewModel: roleViewModel,
                                shiftViewModel: shiftViewModel,
                                assignment: assignment, assignmentViewModel: assignmentViewModel
                            )
                        } label: {
                            RequestRowView(
                                roleViewModel: roleViewModel,
                                shiftViewModel: shiftViewModel,
                                assignment: assignment
                            )
                        }
                    }
                }
                .navigationTitle("Anfragen")
            } detail: {
                Text("Anfrage auswählen")
            }
        }
    }
}
