//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class RoleViewModel: ObservableObject {
    @Published var roles: [Role] = []
    var companyId: Int64

    init(companyId: Int64) {
        self.companyId = companyId
        loadRolesAsync()
    }
    
    private func load() async -> [Role] {
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "\(apiBaseUrl)/api/roles") else {
            print("Invalid URL: role")
            return []
        }

        do {
            let data = try await APIClient.shared.request(url: url)
            return try jsonDecoder.decode([Role].self, from: data)
        } catch {
            print("Failed to load roles:", error)
            return []
        }
    }
    
    private func loadRolesAsync() {
        Task {
            let loadedRoles = await load()
            await MainActor.run {
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
