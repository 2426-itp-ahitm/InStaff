//
//  Model.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//
import Foundation

struct Shift: Identifiable, Decodable {
    let id: Int
    var startTime: String
    var endTime: String
    var companyId: Int
    var companyName: String
    var employees: [Int]
    var reservations: [Int]
    
    private enum CodingKeys: String, CodingKey {
        case id
        case startTime
        case endTime
        case companyId = "company_id"
        case companyName = "company_name"
        case employees
        case reservations
    }
}

struct Employee: Identifiable, Decodable, Encodable {
    let id: Int
    var firstname: String
    var lastname: String
    var email: String
    var telephone: String
    var password: String
    var birthdate: String
    var companyId: Int64
    var companyName: String
    var roles: [Int]
    
    private enum CodingKeys: String, CodingKey {
        case id
        case firstname
        case lastname
        case email
        case telephone
        case password
        case birthdate
        case companyId = "company_id"
        case companyName = "company_name"
        case roles
    }
}

struct Reservation: Identifiable, Decodable {
    let id: Int
    var name: String
    var infos: String
    var number_of_people: Int
    var start_time: String
    var end_time: String
    var shift: Int
}

struct Assignment: Identifiable, Decodable {
    let id: Int
    var shift: Int
    var role: Int
    var employee: Int
    var confirmed: Bool?
}

struct Role: Identifiable, Decodable {
    let id: Int
    var roleName: String
    var company_id: Int
    var employees: [Int]
}

struct Company: Identifiable, Decodable {
    let id: Int
    var companyName: String
    
    private enum CodingKeys: String, CodingKey {
        case id = "id"
        case companyName = "company_name"
    }
}

func formatDateComponents(_ dateString: String) -> (date: String, time: String)? {
    let parts = dateString.split(separator: "T")
    guard parts.count == 2 else { return nil }
    let date = String(parts[0])
    let time = String(parts[1].prefix(5)) // HH:MM
    return (date, time)
}

func getRoleNames(for employee: Employee, from allRoles: [Role]) -> [String] {
    return allRoles
        .filter { role in employee.roles.contains(role.id) }
        .map { $0.roleName }
}
