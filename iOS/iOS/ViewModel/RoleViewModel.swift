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
    
    private func load() -> [Role] {
        var roles: [Role] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "\(apiBaseUrl)/api/\(companyId)/roles") else {
            print("Invalid URL: role")
            return roles
        }

        let semaphore = DispatchSemaphore(value: 0)

        Task {
            do {
                let data = try await APIClient.shared.request(url: url)
                if let loadedRoles = try? jsonDecoder.decode([Role].self, from: data) {
                    roles = loadedRoles
                } else {
                    print("Failed to decode roles")
                }
            } catch {
                print("Failed to load roles:", error)
            }
            semaphore.signal()
        }

        semaphore.wait()
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
