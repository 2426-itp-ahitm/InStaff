//
//  DateUtils.swift
//  iOS
//
//  Created by Alexander Hahn on 06.06.25.
//

import Foundation

struct DateUtils {
    static func format(_ isoString: String) -> String {
        let inputFormatter = DateFormatter()
        inputFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        inputFormatter.locale = Locale(identifier: "en_US_POSIX")

        let outputFormatter = DateFormatter()
        outputFormatter.dateFormat = "dd.MM.yyyy – HH:mm"
        outputFormatter.locale = Locale(identifier: "de_DE")

        if let date = inputFormatter.date(from: isoString) {
            return outputFormatter.string(from: date)
        } else {
            return "Ungültiges Datum"
        }
        
    }
    
    static func isSameDay(_ isoString1: String, _ isoString2: String) -> Bool {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        formatter.locale = Locale(identifier: "en_US_POSIX")

        guard let date1 = formatter.date(from: isoString1),
              let date2 = formatter.date(from: isoString2) else {
            return false
        }

        return Calendar.current.isDate(date1, inSameDayAs: date2)
    }
}
