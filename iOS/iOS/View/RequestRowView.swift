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
    @ObservedObject var roleViewModel = RoleViewModel()
    
    var body: some View {
        let employeeVM = EmployeeViewModel(companyId: session.companyId!)
        let shiftVM = ShiftViewModel(companyId: session.companyId!)
        
        HStack(spacing: 12) {
            // Startzeit
            if shiftVM.shifts.indices.contains(assignment.shift) {
                let shift = shiftVM.shifts[assignment.shift]
                Text("\(formatDateComponents(shift.startTime)?.date ?? "") \(formatDateComponents(shift.startTime)?.time ?? "")")
                    .font(.caption)
                    .frame(minWidth: 100, alignment: .leading)
                
                // Endzeit
                Text("\(formatDateComponents(shift.endTime)?.date ?? "") \(formatDateComponents(shift.endTime)?.time ?? "")")
                    .font(.caption)
                    .frame(minWidth: 100, alignment: .leading)
            } else {
                Text("Loading shifts...")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .frame(minWidth: 200, alignment: .leading)
            }
            
            // Rolle
            Text(roleViewModel.roleName(for: assignment.role))
                .font(.caption)
                .bold()
                .frame(minWidth: 80, alignment: .leading)
            
            Spacer()
            
            // Buttons
            Button("Accept") {
                // Accept action hier
            }
            .font(.caption)
            .padding(6)
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(6)
            
            Button("Decline") {
                // Decline action hier
            }
            .font(.caption)
            .padding(6)
            .background(Color(.systemGray5))
            .foregroundColor(.black)
            .cornerRadius(6)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 2)
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
