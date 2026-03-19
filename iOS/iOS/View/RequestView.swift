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
    @State private var filterByUpcomingOnly = false
    
    var filteredAssignments: [Assignment] {
        guard let employeeId = session.employee?.id else { return [] }
        
        return assignmentViewModel.assignments
            .filter { assignment in
                if let selectedRoleId = selectedRoleId {
                    return assignment.role.id == selectedRoleId
                }
                return true
            }
            .sorted { l, r in
                let now = Date()

                let lStart = DateUtils.toDate(l.shift.startTime) ?? .distantFuture
                let rStart = DateUtils.toDate(r.shift.startTime) ?? .distantFuture

                let lIsPast = lStart < now
                let rIsPast = rStart < now

                // Future assignments first, past assignments last
                if lIsPast != rIsPast {
                    return !lIsPast
                }

                // Both future → sort ascending (next first)
                if !lIsPast {
                    return lStart < rStart
                }

                // Both past → sort descending (most recent past first)
                return lStart > rStart
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
        //Text("employeeId: \(session.employeeId.map(String.init) ?? "nix")")
        VStack{
            NavigationStack {
                Menu("Filter") {
                    Picker("Rolle", selection: $selectedRoleId) {
                        Text("Alle Rollen").tag(nil as Int?)
                        ForEach(roleViewModel.roles) { role in
                            let employeeRoles = session.employee?.roles ?? []

                            if employeeRoles.isEmpty || employeeRoles.contains(where: { $0.id == role.id }) {
                                Text(role.roleName).tag(role.id as Int?)
                            }
                        }
                    }

                }
                .padding()
                List {
                    //Text("Count: \(filteredAssignments.count)")
                    ForEach(filteredAssignments, id: \.id) { assignment in
                        
                        HStack {
                            RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
                        }
                        .opacity(isPast(assignment) ? 0.4 : 1.0)
                        .contentShape(Rectangle())
                        .swipeActions(edge: .leading) {
                            Button {
                                Task {
                                    await assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                                }
                            } label: {
                                Label("Annehmen", systemImage: "checkmark")
                            }
                            .tint(.green)
                            .disabled(isPast(assignment))
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                Task {
                                    await assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                                }
                            } label: {
                                Label("Ablehnen", systemImage: "xmark")
                            }
                            .disabled(isPast(assignment))
                            .tint(.red)
                        }
                    }
                }
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
