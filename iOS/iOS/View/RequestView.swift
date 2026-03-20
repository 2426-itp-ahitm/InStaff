//
//  RequestView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct RequestView: View {
    @EnvironmentObject var session: SessionManager
    @ObservedObject var assignmentViewModel: AssignmentViewModel
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var shiftViewModel: ShiftViewModel
    
    @State private var selectedRoleId: Int? = nil

    var availableRoles: [Role] {
        let employeeRoles = session.employee?.roles ?? []
        let roleIds = Set(employeeRoles.map(\.id))
        return roleViewModel.roles.filter { roleIds.isEmpty || roleIds.contains($0.id) }
    }

    var roleFilteredAssignments: [Assignment] {
        assignmentViewModel.assignments.filter { assignment in
            if let selectedRoleId {
                return assignment.role.id == selectedRoleId
            }

            let employeeRoleIds = Set((session.employee?.roles ?? []).map(\.id))
            return employeeRoleIds.isEmpty || employeeRoleIds.contains(assignment.role.id)
        }
    }

    var upcomingAssignments: [Assignment] {
        let now = Date()
        let limit = Calendar.current.date(byAdding: .day, value: 30, to: now) ?? now

        return roleFilteredAssignments
            .filter { assignment in
                guard let startDate = DateUtils.toDate(assignment.shift.startTime) else {
                    return false
                }
                return startDate >= now && startDate <= limit
            }
            .sorted {
                (DateUtils.toDate($0.shift.startTime) ?? .distantFuture) <
                (DateUtils.toDate($1.shift.startTime) ?? .distantFuture)
            }
    }

    var pastAssignments: [Assignment] {
        let now = Date()
        let limit = Calendar.current.date(byAdding: .day, value: -30, to: now) ?? now

        return roleFilteredAssignments
            .filter { assignment in
                guard let startDate = DateUtils.toDate(assignment.shift.startTime) else {
                    return false
                }
                return startDate < now && startDate >= limit
            }
            .sorted {
                (DateUtils.toDate($0.shift.startTime) ?? .distantPast) >
                (DateUtils.toDate($1.shift.startTime) ?? .distantPast)
            }
    }
    
    func isPast(_ assignment: Assignment) -> Bool {
        let endString = assignment.shift.endTime
        guard let endDate = DateUtils.toDate(endString) else {
            return false
        }

        return endDate < Date()
    }
    

    var body: some View {
        VStack {
            Menu("Filter") {
                Picker("Rolle", selection: $selectedRoleId) {
                    Text("Alle Rollen").tag(nil as Int?)
                    ForEach(availableRoles) { role in
                        Text(role.roleName).tag(role.id as Int?)
                    }
                }
            }
            .padding(.horizontal)

            List {
                if upcomingAssignments.isEmpty && pastAssignments.isEmpty {
                    Text("Du hast derzeit keine Schichten.")
                        .foregroundColor(.gray)
                }

                if !upcomingAssignments.isEmpty {
                    Section("Bevorstehend") {
                        ForEach(upcomingAssignments, id: \.id) { assignment in
                            assignmentRow(assignment)
                        }
                    }
                }

                if !pastAssignments.isEmpty {
                    Section("Vergangen") {
                        ForEach(pastAssignments, id: \.id) { assignment in
                            assignmentRow(assignment)
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func assignmentRow(_ assignment: Assignment) -> some View {
        let past = isPast(assignment)

        HStack {
            RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
        }
        .opacity(past ? 0.4 : 1.0)
        .contentShape(Rectangle())
        .swipeActions(edge: .leading) {
            Button {
                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
            } label: {
                Label("Annehmen", systemImage: "checkmark")
            }
            .tint(.green)
            .disabled(past)
        }
        .swipeActions(edge: .trailing) {
            Button(role: .destructive) {
                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
            } label: {
                Label("Ablehnen", systemImage: "xmark")
            }
            .disabled(past)
            .tint(.red)
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
