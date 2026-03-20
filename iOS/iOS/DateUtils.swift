//
//  DateUtils.swift
//  iOS
//
//  Created by Alexander Hahn on 06.06.25.
//

import Foundation

struct DateUtils {
    private static let isoDateTimeFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        return formatter
    }()

    private static let birthDateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy"
        formatter.locale = Locale(identifier: "de_DE")
        return formatter
    }()

    static func format(_ isoString: String) -> String {
        let outputFormatter = DateFormatter()
        outputFormatter.dateFormat = "dd.MM.yyyy – HH:mm"
        outputFormatter.locale = Locale(identifier: "de_DE")

        if let date = isoDateTimeFormatter.date(from: isoString) {
            return outputFormatter.string(from: date)
        } else {
            return "Ungültiges Datum"
        }
        
    }
    
    static func isSameDay(_ isoString1: String, _ isoString2: String) -> Bool {
        guard let date1 = isoDateTimeFormatter.date(from: isoString1),
              let date2 = isoDateTimeFormatter.date(from: isoString2) else {
            return false
        }

        return Calendar.current.isDate(date1, inSameDayAs: date2)
    }
    
    static func toDate(_ isoString: String) -> Date? {
        isoDateTimeFormatter.date(from: isoString)
    }

    static func formatBirthDate(_ birthDate: String) -> String {
        guard let date = parseBirthDate(birthDate) else {
            return ""
        }
        return birthDateFormatter.string(from: date)
    }

    static func parseBirthDate(_ birthDate: String) -> Date? {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        return formatter.date(from: birthDate)
    }

    static func toApiBirthDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        return formatter.string(from: date)
    }

    static func formatHourlyWage(_ wage: Double) -> String {
        let formatter = NumberFormatter()
        formatter.locale = Locale(identifier: "de_DE")
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        formatter.minimumIntegerDigits = 1
        return formatter.string(from: NSNumber(value: wage)) ?? String(format: "%.2f", wage)
    }
}
