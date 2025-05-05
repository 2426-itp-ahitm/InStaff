//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class RoleViewModel: ObservableObject {
    @Published var roles: [Role] = []

    init() {
        loadRolesAsync()
    }

    private func load() -> [Role] {
        var roles: [Role] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "http://localhost:8080/api/roles") else {
            print("Invalid URL")
            return roles
        }

        if let data = try? Data(contentsOf: url) {
            if let loadedRoles = try? jsonDecoder.decode([Role].self, from: data) {
                roles = loadedRoles
                print("Roles loaded: \(roles.count)")
            } else {
                print("Failed to decode roles")
            }
        } else {
            print("Failed to load data from URL")
        }

        return roles
    }

    private func loadRolesAsync() {
        DispatchQueue.global(qos: .background).async {
            let loadedRoles = self.load()
            DispatchQueue.main.async {
                self.roles = loadedRoles
            }
        }
    }

    func roleName(for roleId: Int) -> String {
        guard let role = roles.first(where: { $0.id == roleId }) else {
            return "Unknown"
        }
        return role.roleName
    }

    func count() -> Int {
        return roles.count
    }
}
