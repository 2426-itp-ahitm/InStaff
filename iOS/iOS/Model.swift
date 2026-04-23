//
//  Model.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//
import Foundation
import SwiftUI

let apiBaseUrl = "http://localhost:8080"

struct Shift: Identifiable, Decodable {
    let id: Int
    var shiftName: String
    var startTime: String
    var endTime: String
    var assignments: [Assignment]

    enum CodingKeys: String, CodingKey {
        case id, shiftName, startTime, endTime, assignments
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

        id = try container.decode(Int.self, forKey: .id)
        shiftName = try container.decode(String.self, forKey: .shiftName)
        startTime = try container.decode(String.self, forKey: .startTime)
        endTime = try container.decode(String.self, forKey: .endTime)
        assignments = try container.decodeIfPresent([Assignment].self, forKey: .assignments) ?? []
    }
}


struct Employee: Identifiable, Decodable, Equatable {
    static func == (lhs: Employee, rhs: Employee) -> Bool {
        lhs.id == rhs.id || lhs.keycloakUserId == rhs.keycloakUserId
    }
    
    let id: Int64
    var keycloakUserId: String
    var firstname: String
    var lastname: String
    var email: String
    var telephone: String
    var birthDate: String
    var isManager: Bool
    var hourlyWage: Double
    var address: String
    var company: Company!
    var roles: [Role]
    var isActive: Bool?
    
    enum CodingKeys: String, CodingKey {
        case id, keycloakUserId, firstname, lastname, email, telephone, birthDate, birthdate, isManager, hourlyWage, address, company, roles, isActive
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int64.self, forKey: .id)
        keycloakUserId = try container.decode(String.self, forKey: .keycloakUserId)
        firstname = try container.decode(String.self, forKey: .firstname)
        lastname = try container.decode(String.self, forKey: .lastname)
        email = try container.decode(String.self, forKey: .email)
        telephone = try container.decode(String.self, forKey: .telephone)
        birthDate = try container.decodeIfPresent(String.self, forKey: .birthDate)
            ?? container.decodeIfPresent(String.self, forKey: .birthdate)
            ?? ""
        isManager = try container.decode(Bool.self, forKey: .isManager)
        hourlyWage = try container.decode(Double.self, forKey: .hourlyWage)
        address = try container.decode(String.self, forKey: .address)
        company = try container.decodeIfPresent(Company.self, forKey: .company)
        roles = try container.decodeIfPresent([Role].self, forKey: .roles) ?? []
        isActive = try container.decodeIfPresent(Bool.self, forKey: .isActive)
    }
}

struct Assignment: Identifiable, Decodable {
    let id: Int
    var status: AssignmentStatus?
    var employee: Employee
    var shift: Shift
    var role: Role
}

struct Role: Identifiable, Codable {
    let id: Int
    var roleName: String
    var description: String
}

struct Company: Identifiable, Codable, Equatable {
    let id: Int
    var companyName: String
}

func formatDateComponents(_ dateString: String) -> (date: String, time: String)? {
    let parts = dateString.split(separator: "T")
    guard parts.count == 2 else { return nil }
    let date = String(parts[0])
    let time = String(parts[1].prefix(5)) // HH:MM
    return (date, time)
}

func parseISODate(_ string: String) -> Date? {
    let formatter = ISO8601DateFormatter()
    return formatter.date(from: string)
}

func formatTime(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm"
    return formatter.string(from: date)
}
