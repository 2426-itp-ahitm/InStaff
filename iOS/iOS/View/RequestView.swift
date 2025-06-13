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

    init(companyId: Int) {
        _assignmentViewModel = StateObject(wrappedValue: AssignmentViewModel(companyId: companyId))
        _roleViewModel = StateObject(wrappedValue: RoleViewModel(companyId: companyId))
        _shiftViewModel = StateObject(wrappedValue: ShiftViewModel(companyId: companyId))
    }

    var body: some View {
        let filteredAssignments = assignmentViewModel.assignments.filter { $0.employee == session.employeeId }
        NavigationSplitView {
            List(filteredAssignments) { assignment in
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
                .navigationTitle("Requests")
            }
        } detail: {
            Text("Select a request")
        }
        
    }
}

