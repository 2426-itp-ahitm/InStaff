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
                            .tint(.green)
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                            } label: {
                                Label("Ablehnen", systemImage: "xmark")
                            }
                            .tint(.red)
                        }
                    }
                }
                .navigationTitle("Aktuelle Anfragen")
            } detail: {
                Text("Wählen Sie eine Anfrage")
            }
        }
    }
    
}

#Preview {
    HomeView()
}

