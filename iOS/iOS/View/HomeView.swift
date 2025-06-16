//
//  HomeView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var session: SessionManager
    @StateObject var assignmentViewModel = AssignmentViewModel(companyId: 1)
    @StateObject var shiftViewModel = ShiftViewModel(companyId: 1)
    @StateObject var roleViewModel = RoleViewModel(companyId: 1)

    var filteredAssignments: [Assignment] {
        assignmentViewModel.assignments
            .filter { $0.employee == session.employeeId }
            .filter {
                let calendar = Calendar.current
                let now = Date()
                let weekday = calendar.component(.weekday, from: now)
                let daysUntilEndOfWeek = 8 - weekday
                let endOfWeek = calendar.date(byAdding: .day, value: daysUntilEndOfWeek, to: now)!
                let endOfWeekAtMidnight = calendar.startOfDay(for: endOfWeek)
                
                
                if let shift = shiftViewModel.shift(for: $0.shift) {
                    return DateUtils.toDate(shift.startTime)! > Date() && DateUtils.toDate(shift.startTime)! < endOfWeekAtMidnight
                }
                return false
            }
            .sorted { l, r in
                guard let lShift = shiftViewModel.shift(for: l.shift),
                      let rShift = shiftViewModel.shift(for: r.shift) else {
                    return false
                }
                return lShift.startTime > rShift.startTime
            }
            
    }

    var body: some View {
        VStack{
            NavigationSplitView {
                List {
                    ForEach(filteredAssignments) { assignment in
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
                    }
                }
                .navigationTitle("Requests")
            } detail: {
                Text("Select a request")
            }
        }
    }
}

#Preview {
    HomeView()
}
