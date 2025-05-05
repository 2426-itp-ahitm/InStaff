//
//  Model.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//
import Foundation

struct Shift: Identifiable, Decodable {
    let id: Int64
    let startTime: String
    let endTime: String
    let company_id: Int64
    let company_name: String
    let employees: [Employee]
    let reservations: [Reservation]
}

struct Employee: Identifiable, Decodable {
    let id: Int64
    let firstname: String
    let lastname: String
    let email: String
    let telephone: String
    let password: String
    let birthdate: String
    let company_id: Int64
    let company_name: String
    let roles: [Int]
}

struct Reservation: Identifiable, Decodable {
    let id: Int64
    let name: String
    let infos: String
    let number_of_people: Int
    let start_time: String
    let end_time: String
    let shift: Int
}

struct Assignement: Identifiable, Decodable {
    let id: Int64
    let shift: Int64
    let role: Int64
    let employee: Int64
    let confirmed: Bool?
}

struct Role: Identifiable, Decodable {
    let id: Int64
    let name: String
}
