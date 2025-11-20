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
                        HStack {
                            // Minimal placeholder content for the row; replace with your RequestRowView if desired
                            RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
                            /*Text("Assignment #\(assignment.id)")
                                .font(.body)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            */
                        }
                        .contentShape(Rectangle())
                        .padding(.vertical, 4)
                        .listRowSeparator(.visible)
                        .swipeActions(edge: .leading) {
                            Button {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                            } label: {
                                Label("Annehmen", systemImage: "checkmark")
                            }
                            .tint(.green)
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                            } label: {
                                Label("Ablehnen", systemImage: "xmark")
                            }
                            .tint(.red)
                        }
                    }
                }
            } detail: {
                Text("Anfrage auswählen")
            }
        }
    }
}

/*NavigationLink {
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
}*/
//                .navigationTitle("Anfragen")
