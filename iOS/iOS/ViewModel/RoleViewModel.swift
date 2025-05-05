//
//  RoleViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class RoleViewModel: ObservableObject {
    @Published var roles: [Int64: String] = [:]

    init() {
        loadRoles()
    }

    func loadRoles() {
        guard let url = URL(string: "http://localhost:8080/api/roles") else {
            print("Invalid URL")
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching roles: \(error)")
                return
            }

            guard let data = data else {
                print("No data received")
                return
            }

            do {
                let fetchedRoles = try JSONDecoder().decode([Role].self, from: data)
                DispatchQueue.main.async {
                    self.roles = Dictionary(uniqueKeysWithValues: fetchedRoles.map { ($0.id, $0.name) })
                }
            } catch {
                print("Failed to decode roles: \(error)")
            }
        }.resume()
    }

    func roleName(for roleId: Int64) -> String {
        return roles[roleId] ?? "Unbekannt"
    }
}
