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
                      let rShift = shiftViewModel.shift(for: r.shift),
                      let lStart = DateUtils.toDate(lShift.startTime),
                      let rStart = DateUtils.toDate(rShift.startTime) else {
                    return l.id < r.id
                }
                if lStart == rStart { return l.id < r.id }
                return lStart > rStart
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
                            .disabled({
                                if let shift = shiftViewModel.shift(for: assignment.shift),
                                   let start = DateUtils.toDate(shift.startTime) {
                                    return start < Date()
                                }
                                return true // sicherheitshalber deaktivieren, falls kein Datum
                            }())                            .tint(.green)
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                            } label: {
                                Label("Ablehnen", systemImage: "xmark")
                            }
                            .tint(.red)
                            .disabled({
                                if let shift = shiftViewModel.shift(for: assignment.shift),
                                   let start = DateUtils.toDate(shift.startTime) {
                                    return start < Date()
                                }
                                return true // sicherheitshalber deaktivieren, falls kein Datum
                            }())
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
