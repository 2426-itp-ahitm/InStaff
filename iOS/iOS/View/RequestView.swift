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
        let shiftViewModel = ShiftViewModel(companyId: session.companyId!)
        
        let filteredAssignments = assignmentViewModel.assignments.filter { $0.employee == session.employeeId }
        
        
        List(filteredAssignments) { assignment in
            let rawStartDate = shiftViewModel.shiftStartTime(by: assignment.shift)
            let rawEndDate = shiftViewModel.shiftEndTime(by: assignment.shift)
            
            let startDate = DateUtils.format(rawStartDate)
            let endDate = DateUtils.format(rawEndDate)
            
            let (confirmationText, confirmationColor): (String, Color) = {
                    switch assignment.confirmed {
                    case true:
                        return ("Confirmed", .green)
                    case false:
                        return ("Rejected", .red)
                    default:
                        return ("Not confirmed", .blue)
                    }
            }()
            
            VStack(alignment: .leading) {
                Text("\(assignment.id)").foregroundColor(.gray)
                if startDate.prefix(10) == endDate.prefix(10) {
                    Text("\(startDate.prefix(10)):").bold() +
                    Text(" \(startDate.suffix(5)) - \(endDate.suffix(5))")
                } else {
                    Text("\(startDate)").bold() +
                    Text(" - \(endDate)")
                }
                
                RoleTag(roleName: roleViewModel.roleName(for: assignment.role));
                
                Text(confirmationText)
                    .foregroundColor(confirmationColor)
            }
        }
    }
}

#Preview {
    RequestView(companyId: 1)
        .environmentObject(SessionManager())
}
