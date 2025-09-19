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

        if let data = try? Data(contentsOf: url) {
            if let fetchedCompanies = try? jsonDecoder.decode([Company].self, from: data) {
                companies = fetchedCompanies
                //print(companies)
            } else {
                print("Failed to decode companies")
            }
        } else {
            print("Failed to load data from URL")
        }

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
