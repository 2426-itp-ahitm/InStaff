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
    

    init(companyId: Int) {
        _assignmentViewModel = StateObject(wrappedValue: AssignmentViewModel(companyId: companyId))
    }

    var body: some View {
        let roleViewModel = RoleViewModel(companyId: session.companyId!)
        
        let filteredAssignments = assignmentViewModel.assignments.filter { $0.employee == session.employeeId }
        
        List(filteredAssignments) { assignment in
            VStack(alignment: .leading) {
                Text("Shift ID: \(assignment.shift)")
            RoleTag(roleName: roleViewModel.roleName(for: assignment.role));    Text("Employee ID: \(assignment.employee)")
                Text("Confirmed: \(assignment.confirmed == true ? "Yes" : "No")")
            }
        }
    }
}

#Preview {
    RequestView(companyId: 1)
        .environmentObject(SessionManager())
}
