//
//  SwipeTip.swift
//  iOS
//
//  Created by Alexander Hahn on 14.11.25.
//

import Foundation
import TipKit

struct SwipeTip: Tip {
    var title: Text {
        Text("Wische nach rechts zum Annehmen \n Nach links kannst du ablehnen")
    }
    var message: Text {
        Text("")
    }
}
