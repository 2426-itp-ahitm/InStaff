//
//  RequestRowView.swift
//  iOS
//
//  Created by Alexander Hahn on 29.05.25.
//

import SwiftUI

struct RequestRowView: View {
    @EnvironmentObject var session: SessionManager
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var shiftViewModel: ShiftViewModel
    var assignment: Assignment
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
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
                    // Example: Monday, Sep 22, 2025: 08:00 – 16:00
                    (Text("\(weekdayStart), \(dateStart):").bold() + Text(" \(timeStart) – \(timeEnd)"))
                } else {
                    // Example: Monday, Sep 22, 2025 20:00 – Tuesday, Sep 23, 2025 04:00
                    (Text("\(weekdayStart), \(dateStart) \(timeStart)").bold() + Text(" – ") + Text("\(weekdayEnd), \(dateEnd) \(timeEnd)"))
                }
            } else {
                // Fallback: original behavior with string slicing
                if startTextFallback.prefix(10) == endTextFallback.prefix(10) {
                    Text("\(startTextFallback.prefix(10)):").bold() + Text(" \(startTextFallback.suffix(5)) - \(endTextFallback.suffix(5))")
                } else {
                    Text("\(startTextFallback)").bold() + Text(" - \(endTextFallback)")
                }
            }

            RoleTag(roleName: roleViewModel.roleName(for: assignment.role))

            let (confirmationText, confirmationColor): (String, Color) = {
                switch assignment.confirmed {
                case true:
                    return ("Angenommen", .green)
                case false:
                    return ("Abgelehnt", .red)
                default:
                    return ("Nicht ausgewählt", .blue)
                }
            }()

            Text(confirmationText)
                .foregroundColor(confirmationColor)
        }
    }
}
