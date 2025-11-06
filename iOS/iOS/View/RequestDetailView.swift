//
//  RequestDetailView.swift
//  iOS
//
//  Created by Alexander Hahn on 13.06.25.
//

import SwiftUI

struct RequestDetailView: View {
    @EnvironmentObject var session: SessionManager
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var shiftViewModel: ShiftViewModel
    var assignment: Assignment
    
    @ObservedObject var assignmentViewModel: AssignmentViewModel
    @State private var confirmResult: Bool? = nil
    @State private var errorMessage: String? = nil
    
    var isPastShift: Bool {
        if let startTime = shiftViewModel.shift(for: assignment.shift)?.startTime,
           let shiftDate = DateUtils.toDate(startTime) {
            return shiftDate < Date()
        }
        return false
    }
    
    private func germanWeekdayName(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "de_DE")
        return formatter.weekdaySymbols[Calendar.current.component(.weekday, from: date) - 1]
    }
    
    var body: some View {
        VStack() {
            Form{
                Section {
                    // Build Dates
                    let rawStartDate = shiftViewModel.shiftStartTime(by: assignment.shift)
                    let rawEndDate = shiftViewModel.shiftEndTime(by: assignment.shift)
                    
                    // Parse to Date for accurate comparisons
                    let startDate = DateUtils.toDate(rawStartDate)
                    let endDate = DateUtils.toDate(rawEndDate)
                    
                    // Fallback formatted strings
                    let startTextFallback = DateUtils.format(rawStartDate)
                    let endTextFallback = DateUtils.format(rawEndDate)
                    
                    // Localized formatters
                    let weekdayFormatter: DateFormatter = {
                        let df = DateFormatter()
                        df.locale = Locale(identifier: "de_DE")
                        df.setLocalizedDateFormatFromTemplate("EEEE")
                        return df
                    }()
                    
                    let dateFormatter: DateFormatter = {
                        let df = DateFormatter()
                        df.locale = Locale(identifier: "de_DE")
                        df.setLocalizedDateFormatFromTemplate("yMMMd")
                        return df
                    }()
                    
                    let timeFormatter: DateFormatter = {
                        let df = DateFormatter()
                        df.locale = Locale(identifier: "de_DE")
                        df.setLocalizedDateFormatFromTemplate("HHmm")
                        return df
                    }()
                    
                    // Build the header line with weekday and date
                    if let s = startDate, let e = endDate {
                        let cal = Calendar.current
                        let sameDay = cal.isDate(s, inSameDayAs: e)
                        
                        let weekdayStart = weekdayFormatter.string(from: s)
                        let dateStart = dateFormatter.string(from: s)
                        let timeStart = timeFormatter.string(from: s)
                        let weekdayEnd = weekdayFormatter.string(from: e)
                        let dateEnd = dateFormatter.string(from: e)
                        let timeEnd = timeFormatter.string(from: e)
                        
                        if sameDay {
                            // Example: Montag, Sep 22, 2025: 08:00 – 16:00
                            (Text("\(weekdayStart), \(dateStart):").bold() + Text(" \(timeStart) – \(timeEnd)"))
                        } else {
                            // Example: Montag, Sep 22, 2025 20:00 – Dienstag, Sep 23, 2025 04:00
                            (Text("\(weekdayStart), \(dateStart) \(timeStart)").bold() + Text(" – \n") + Text("\(weekdayEnd), \(dateEnd) \(timeEnd)"))
                        }
                    } else {
                        // Fallback: original behavior with string slicing
                        if startTextFallback.prefix(10) == endTextFallback.prefix(10) {
                            Text("\(startTextFallback.prefix(10)):").bold() + Text(" \(startTextFallback.suffix(5)) - \(endTextFallback.suffix(5))")
                        } else {
                            Text("\(startTextFallback)").bold() + Text(" - \(endTextFallback)")
                        }
                    }
                    
                    RoleTag(roleColorManager: RoleColorManager(roleViewModel: RoleViewModel(companyId: session.companyId!)), roleName: roleViewModel.roleName(for: assignment.role))
                        .font(.title)
                    
                    
                    VStack {
                        HStack(spacing: 10) {
                            // Tri-state based on optional confirmation
                            let confirmed = assignment.confirmed // Bool?
                            
                            // Accept appearance
                            let acceptIcon: String = (confirmed == true) ? "checkmark.circle.fill" : "checkmark.circle"
                            let acceptColor: Color = (confirmed == true) ? .green : .gray
                            
                            HStack(spacing: 8) {
                                Image(systemName: acceptIcon)
                                    .imageScale(.medium)
                                    .foregroundColor(acceptColor)
                                Button("Annehmen") {
                                    let success = assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                                    confirmResult = success ? true : false
                                    errorMessage = success ? nil : "Failed to accept assignment. Please try again later."
                                }
                                .disabled(isPastShift)
                            }
                            .padding(5)
                            .background(
                                RoundedRectangle(cornerRadius: 20, style: .continuous)
                                    .stroke(acceptColor, lineWidth: 2)
                            )
                            .foregroundColor(acceptColor)
                            
                            // Decline appearance
                            let declineIcon: String = (confirmed == false) ? "xmark.circle.fill" : "xmark.circle"
                            let declineColor: Color = (confirmed == false) ? .red : .gray
                            
                            HStack(spacing: 8) {
                                Image(systemName: declineIcon)
                                    .imageScale(.medium)
                                    .foregroundColor(declineColor)
                                Button("Ablehnen") {
                                    let success = assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                                    confirmResult = success ? true : false
                                    errorMessage = success ? nil : "Failed to accept assignment. Please try again later."
                                }
                                .disabled(isPastShift)
                            }
                            .padding(5)
                            .background(
                                RoundedRectangle(cornerRadius: 20, style: .continuous)
                                    .stroke(declineColor, lineWidth: 2)
                            )
                            .foregroundColor(declineColor)
                        }
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding()
                        
                        
                        if let errorMessage = errorMessage {
                            Text(errorMessage)
                        }
                        
                        if isPastShift {
                            Text("Du darfst keine Schicht annehmen/ablehnen, die bereits vorbei ist.")
                        }
                    }
                }
                .padding(.vertical, 10)
            }
        }
    }
    
}
