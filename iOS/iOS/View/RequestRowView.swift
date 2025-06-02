//
//  RequestRowView.swift
//  iOS
//
//  Created by Alexander Hahn on 29.05.25.
//

import SwiftUI

struct RequestRowView: View {
    var assignment: Assignment
    @EnvironmentObject var session: SessionManager
    
    var body: some View {
        let roleViewModel = RoleViewModel(companyId: session.companyId!)
        let employeeVM = EmployeeViewModel(companyId: session.companyId!)
        let shiftVM = ShiftViewModel(companyId: session.companyId!)
        
        HStack(spacing: 12) {
            if shiftVM.shifts.indices.contains(assignment.shift) {
                let shift = shiftVM.shifts[assignment.shift]
                Text("\(shift.startTime) - \(shift.endTime)")
            } else {
                Text("Loading shifts")
            }
            
            
        }
    }
}

#Preview {
    let session = SessionManager()
    session.companyId = 0
    
    return Group {
        RequestRowView(assignment: Assignment(id: 1, shift: 1, role: 1, employee: 1, confirmed: nil))
            .environmentObject(session)
        RequestRowView(assignment: Assignment(id: 2, shift: 1, role: 2, employee: 2, confirmed: nil))
            .environmentObject(session)
    }
}
