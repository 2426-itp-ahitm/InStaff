//
//  HomeView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

struct HomeView: View {
    var body: some View {
        VStack {
            Image("logo-black")
                .resizable()
                .scaledToFit()
                .frame(width: 100)
                .padding()
            Text("Current Requests").font(.title).bold()
            
            Text("More").font(.title).bold()
            RequestCardView(assignment: Assignment(id: 1, shift: 1, role: 1, employee: 1, confirmed: nil))
        }
        
    }
}

#Preview {
    HomeView()
}
