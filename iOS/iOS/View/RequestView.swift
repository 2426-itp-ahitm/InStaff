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
        guard let employeeId = session.employeeId else { return [] }
        
        return assignmentViewModel.assignments
            .filter { $0.employee == employeeId }
            .filter { assignment in
                if let selectedRoleId = selectedRoleId {
                    return assignment.role == selectedRoleId
                }
                return true
            }
            .sorted { l, r in
                let lShift = shiftViewModel.shift(for: l.shift)
                let rShift = shiftViewModel.shift(for: r.shift)

                let lDate = lShift.flatMap { DateUtils.toDate($0.startTime) } ?? .distantPast
                let rDate = rShift.flatMap { DateUtils.toDate($0.startTime) } ?? .distantPast

                return lDate < rDate
            }
    }
    
    func isPast(_ assignment: Assignment) -> Bool {
        if let shift = shiftViewModel.shift(for: assignment.shift),
           let start = DateUtils.toDate(shift.startTime) {
            return start < Date()
        }
        return true
    }

    var body: some View {
        //Text("employeeId: \(session.employeeId.map(String.init) ?? "nix")")
        VStack{
            NavigationStack {
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
                    //Text("Count: \(filteredAssignments.count)")
                    ForEach(filteredAssignments, id: \.id) { assignment in
                        
                        HStack {
                            RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
                        }
                        .contentShape(Rectangle())
                        .swipeActions(edge: .leading) {
                            Button {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                            } label: {
                                Label("Annehmen", systemImage: "checkmark")
                            }
                            .disabled(isPast(assignment))
                            .tint(.green)
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                            } label: {
                                Label("Ablehnen", systemImage: "xmark")
                            }
                            .tint(.red)
                            .disabled(isPast(assignment))
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
