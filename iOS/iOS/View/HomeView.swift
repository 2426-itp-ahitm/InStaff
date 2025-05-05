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
        }
        
    }
}

#Preview {
    HomeView()
}
