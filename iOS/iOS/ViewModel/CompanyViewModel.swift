//
//  CompanyViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 29.05.25.
//


import Foundation

class CompanyViewModel: ObservableObject {
    @Published var companies: [Company] = []
    
    init() {
        loadCompaniesAsync()
    }
    
    private func load() -> [Company] {
        var companies: [Company] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "\(apiBaseUrl)/api/companies") else {
            print("Invalid URL: company")
            return companies
        }

        let semaphore = DispatchSemaphore(value: 0)

        Task {
            do {
                let data = try await APIClient.shared.request(url: url)
                if let fetchedCompanies = try? jsonDecoder.decode([Company].self, from: data) {
                    companies = fetchedCompanies
                } else {
                    print("Failed to decode companies")
                }
            } catch {
                print("Failed to load companies:", error)
            }
            semaphore.signal()
        }

        semaphore.wait()
        return companies
    }
    
    private func loadCompaniesAsync() {
        DispatchQueue.global(qos: .background).async {
            let loadedCompanies = self.load()
            DispatchQueue.main.async {
                self.companies = loadedCompanies
                //print(self.companies)
            }
        }
    }
}
