//
//  RequestCardView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct RequestCardView: View {
    @State var assignment: Assignment
    
    @ObservedObject var shiftViewModel = ShiftViewModel()
    @ObservedObject var employeeViewModel = EmployeeViewModel()
    @ObservedObject var roleViewModel = RoleViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            let shift: Shift = shiftViewModel.shifts[assignment.shift]
            Text(shiftViewModel.shiftStartTime(index: assignment.shift) ?? "")
            //        .font(.headline)
            //Text($shiftViewModel.shiftTime(for: shift))
            //        .font(.subheadline)
            
            
            Text(employeeViewModel.employeeName(for: assignment.employee))
                .font(.subheadline)
                .foregroundColor(.secondary)

            Text("Role: \(roleViewModel.roleName(for: assignment.role))")
                .font(.headline)
                .bold()

            HStack {
                Button(action: {
                }) {
                    Text("Annehmen")
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(8)
                }

                Button(action: {
                }) {
                    Text("Ablehnen")
                        .foregroundColor(.black)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color(.systemGray5))
                        .cornerRadius(8)
                }
            }
            //Text("Hallo")
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 12).fill(Color.white).shadow(radius: 3))
        .padding(.horizontal)
    }

    func formatDate(_ date: String) -> String {
        // Convert date string to a readable format
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZ"
        if let dateObj = formatter.date(from: date) {
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
            return formatter.string(from: dateObj)
        }
        return date
    }
}

#Preview {
    RequestCardView(assignment: Assignment(id: 1, shift: 0, role: 1, employee: 1, confirmed: nil))
}
